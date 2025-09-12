package Mojolicious::Plugin::Inertia;
use Mojo::Base 'Mojolicious::Plugin', -signatures;

sub register ($self, $app, $conf) {
    my $version = $conf->{version} // 'TODO';

    # Add inertia helper
    $app->helper(inertia => sub ($c, $component, $props = {}) {
        my $is_inertia = $c->req->headers->header('X-Inertia');

        if ($is_inertia) {
            $c->res->headers->header('X-Inertia' => 'true');
        }

        $c->res->headers->header('Vary' => 'X-Inertia');

        return $c->render(json => {
            component => $component,
            props => $props,
            url => $c->req->url->to_string,
            version => $version,
        });
    });
}

1;
