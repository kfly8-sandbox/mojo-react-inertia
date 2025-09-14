package Mojolicious::Plugin::Inertia;
use Mojo::Base 'Mojolicious::Plugin', -signatures;
use Mojo::JSON qw(encode_json);
use Scalar::Util qw(reftype);
use Carp qw(croak);

sub register ($self, $app, $conf) {
    croak "Inertia plugin requires a 'version' configuration option" unless $conf->{version};
    croak "Inertia plugin requires a 'layout' configuration option" unless $conf->{layout};

    # Asset versioning. e.g. md5sum of your assets manifest file.
    my $version = $conf->{version};

    # Layout template for non-Inertia requests.
    # It must contain a <%= data_page %> placeholder at the application root.
    my $layout  = ref $conf->{layout} ? $conf->{layout}->slurp : $conf->{layout};

    $app->helper(inertia => sub ($c, $component, $props = {}, $options = {}) {

        # If the client's asset version does not match the server's version,
        # then the client must do a full page reload.
        # So, we respond with a 409 status and an X-Inertia-Location header
        # Ref: https://inertiajs.com/the-protocol#asset-versioning
        my $inertia_version = $c->req->headers->header('X-Inertia-Version');
        if ($c->req->method eq 'GET' && $inertia_version && $inertia_version ne $version) {
            $c->res->headers->header('X-Inertia-Location' => $c->req->url->to_string);
            return $c->rendered(409);
        }

        # Partial reloads allows you to request a subset of the props (data) from the server on subsequent visits to the same page component.
        # Ref: https://inertiajs.com/the-protocol#partial-reloads
        my $partial_data      = $c->req->headers->header('X-Inertia-Partial-Data');
        my $partial_component = $c->req->headers->header('X-Inertia-Partial-Component');
        if ($partial_data && $partial_component) {
            my @only_keys = split /,/, $partial_data;
            $props = { map { $_ => $props->{$_} } @only_keys };
        }

        # Resolve props that are coderefs by calling them with the current controller context.
        # Code refs are useful for lazy loading data only when needed.
        my $resolved_props = {
            map {
                my $key = $_;
                my $prop = $props->{$key};
                ($key => reftype($prop) eq 'CODE' ? $prop->($c) : $prop)
            } keys %$props
        };

        # Construct the page object.
        # Ref: https://inertiajs.com/the-protocol#the-page-object
        my $page_object = {
            component => $component,
            props     => $resolved_props,
            url       => $c->req->url->to_string,
            version   => $version,
            # TODO: encryptHistory, clearHistory
            # Ref: https://inertiajs.com/history-encryption
        };

        # Check if the request is an Inertia request.
        # If so, return a JSON response.
        # Else, return an HTML response with embedded page object.
        # Ref: https://inertiajs.com/the-protocol#inertia-responses
        my $is_inertia = $c->req->headers->header('X-Inertia');

        if ($is_inertia) {
            $c->res->headers->header('X-Inertia' => 'true');
            $c->res->headers->header('Vary' => 'X-Inertia');
            return $c->render(json => $page_object);
        }
        else {
            $c->res->headers->header('Vary' => 'X-Inertia');
            return $c->render(
                inline    => $layout,
                format    => 'html',
                data_page => encode_json($page_object)
            );
        }
    });
}

1;
