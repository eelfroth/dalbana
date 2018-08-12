var peer = new Peer();
var conn = {out: peer.connect('dummy'), in: null};

var dom_form = document.getElementById('form');
var dom_term = document.getElementById('term');

peer.on('open', function(id) {
    log('peer id: ' + id);
});

peer.on('error', function(err) {
    if (err.type == 'peer-unavailable' && conn.out.peer === 'dummy') {
        conn.out = null;
        log('ready!');
    }
    else error(err);
});

peer.on('connection', function(dataConnection) {
        if (!conn.out) log('responding to offer from ' + dataConnection.peer + '...');
    log('incoming <- ' + dataConnection.peer);
    if (!conn.out) connect(dataConnection.peer);

    conn.in = dataConnection;

    conn.in.on('open', function() {
        //log('in: open');
        if(conn.out && conn.out.open) established();
    });

    conn.in.on('error', function(err) {
        error(err);
    });

    conn.in.on('data', function(data) {
        receive(data);
    });
});

function connect(target) {
    log('outgoing -> ' + target);

    conn.out = peer.connect(target);

    conn.out.on('open', function() {
        //log('out: open');
        if(conn.in && conn.in.open) established();
    });

    conn.out.on('error', function(err) {
        error(err);
    });
}

function established() {
    log('peer-to-peer connection established!');
    send('hello from ' + peer.id);
}

function print(type, data) {
    if(type == 'in') {
        dom_term.innerHTML += '<span class="name">' + conn.in.peer + ': </span>';
    } else if(type == 'out') {
        dom_term.innerHTML += '<span class="name">' + peer.id + ': </span>';
    }
    dom_term.innerHTML += '<span class="' + type + '">' + data + '</span><br>';
}

function log(data) {
    console.log(data);
    print('log', data);
}

function error(data) {
    console.error(data);
    print('error', data);
}

function send(data) {
    conn.out.send(data);
    console.log('sending: ' + data);
    print('out', data);
}

function receive(data) {
    console.log('received: ' + data);
    print('in', data);
}

form.onkeydown = function(e){
    if(e.keyCode == 13){
        e.preventDefault();
        log('sending offer to ' + dom_form.value + '...');
        connect(dom_form.value);
        dom_form.value = '';
    }
};
