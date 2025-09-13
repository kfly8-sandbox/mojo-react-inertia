use Mojolicious::Lite -signatures;
use lib 'lib';

plugin 'Inertia';

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
  $todo->{completed} = $json->{completed} if defined $json->{completed};

  $c->redirect_to('/todos');
};

app->start;
