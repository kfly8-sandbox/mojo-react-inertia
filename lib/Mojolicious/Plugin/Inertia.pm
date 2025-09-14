package Mojolicious::Plugin::Inertia;
use Mojo::Base 'Mojolicious::Plugin', -signatures;
use Mojo::JSON qw(encode_json);
use Scalar::Util qw(reftype);

sub register ($self, $app, $conf) {
    my $version = $conf->{version}
                or die "Inertia plugin requires a 'version' configuration option";

    $app->helper(inertia => sub ($c, $component, $props = {}) {
        my $is_inertia        = $c->req->headers->header('X-Inertia');
        my $partial_data      = $c->req->headers->header('X-Inertia-Partial-Data');
        my $partial_component = $c->req->headers->header('X-Inertia-Partial-Component');
        my $inertia_version   = $c->req->headers->header('X-Inertia-Version');

        # 409: Conflict
        # If the client's asset version does not match the server's version,
        # then the client must do a full page reload.
        # So, we respond with a 409 status and an X-Inertia-Location header
        # Ref: https://inertiajs.com/the-protocol#asset-versioning
        if ($c->req->method eq 'GET' && $inertia_version && $inertia_version ne $version) {
            $c->res->headers->header('X-Inertia-Location' => $c->req->url->to_string);
            return $c->rendered(409);
        }

        # Partial reloads
        if ($partial_data && $partial_component) {
            my @only_keys = split /,/, $partial_data;
            $props = { map { $_ => $props->{$_} } @only_keys };
        }

        my $resolved_props = {
            map {
                my $key = $_;
                my $prop = $props->{$key};
                ($key => reftype($prop) eq 'CODE' ? $prop->($c) : $prop)
            } keys %$props
        };

        my $data_page = {
            component => $component,
            props     => $resolved_props,
            url       => $c->req->url->to_string,
            version   => $version,
        };

        if ($is_inertia) {
            # Return JSON response for Inertia requests
            $c->res->headers->header('X-Inertia' => 'true');
            $c->res->headers->header('Vary' => 'X-Inertia');
            return $c->render(json => $data_page);
        }

        # Return HTML with embedded page data for non-Inertia requests
        $c->res->headers->header('Vary' => 'X-Inertia');

        return $c->render(
            inline    => $app->home->child('dist', 'index.html')->slurp,
            format    => 'html',
            data_page => encode_json($data_page)
        );
    });
}

1;
