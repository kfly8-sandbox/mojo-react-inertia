use Mojolicious::Lite -signatures;
use Mojo::Util qw(md5_sum);
use lib 'lib';

plugin 'Inertia', {
    version => md5_sum( app->home->child('dist', '.vite', 'manifest.json')->slurp ),
    layout  => app->home->child('dist', 'index.html')
};

# Serve only assets from dist directory
push @{app->static->paths}, app->home->child('dist', 'assets');

# Route for /assets/* to serve static files
get '/assets/*file' => sub ($c) {
    my $file = $c->param('file');
    return $c->reply->static($file);
};
# Sample todo data (in production, use a database)
my @todos = (
  { id => 1, title => 'Learn Mojolicious', completed => 1 },
  { id => 2, title => 'Build with Inertia.js', completed => 0 },
  { id => 3, title => 'Deploy the app', completed => 0 },
);
my $next_id = 4;

get '/' => sub ($c) {
  $c->inertia('Index', {});
};

get '/hello' => sub ($c) {
  $c->inertia('Hello', {
      user => { name => 'Mojolicious' }
  });
};

# Todo routes
get '/todos' => sub ($c) {
  $c->inertia('Todos/Index', {
    todos => \@todos
  });
};

get '/todos/:id' => sub ($c) {
  my $id = $c->param('id');
  my ($todo) = grep { $_->{id} == $id } @todos;

  unless ($todo) {
    return $c->inertia('Error', {
      status => 404,
      message => 'Todo not found'
    });
  }

  $c->inertia('Todos/Detail', {
    todo => $todo
  });
};

post '/todos' => sub ($c) {
  my $json = $c->req->json;

  unless ($json) {
    return $c->inertia('Error', {
      status => 400,
      message => 'Invalid JSON'
    });
  }

  my $new_todo = {
    id => $next_id++,
    title => $json->{title} // '',
    completed => $json->{completed} // 0
  };

  push @todos, $new_todo;

  $c->redirect_to('/todos');
};

post '/todos/:id' => sub ($c) {
  my $id = $c->param('id');
  my $json = $c->req->json;

  unless ($json) {
    return $c->inertia('Error', {
      status => 400,
      message => 'Invalid JSON'
    });
  }

  my ($todo) = grep { $_->{id} == $id } @todos;
  unless ($todo) {
    return $c->inertia('Error', {
      status => 404,
      message => 'Todo not found'
    });
  }

  $todo->{title} = $json->{title} if defined $json->{title};
  $todo->{completed} = $json->{completed} ? 1 : 0;

  $c->redirect_to('/todos');
};

# Dashboard with partial reload support
get '/dashboard' => sub ($c) {
  # Get partial data request info

  # Load stats only if requested or if no partial data specified
  my $stats = sub {
    return {
      total_todos => scalar(@todos),
      completed_todos => scalar(grep { $_->{completed} == 1 } @todos),
      pending_todos => scalar(grep { $_->{completed} == 0 } @todos),
    };
  };

  # Load metrics only if requested or if no partial data specified
  my $metrics = sub {
    my $current_time = time();
    return {
      last_updated => scalar(localtime($current_time)),
      random_metric => int(rand(100)),
      server_load => sprintf("%.2f", rand(4)),
    };
  };

  # Load recent todos only if requested or if no partial data specified
  my $recent_todos = sub {
    return [ grep { defined } (reverse @todos)[0..2] ];
  };

  $c->inertia('Dashboard', {
    stats => $stats,
    metrics => $metrics,
    recent_todos => $recent_todos,
  });
};

app->start;
