window.onload = function() {
    Action.start();
};


var Action = {
    start: function() {
        var obj = new game();
        obj.play();
        FireBase.run();
    },
};


var game = function() {
    return {
        play: function(param) {
            $('.sity-item').click(function() {
                $('#main-container').html($(this).attr('key'));
                console.log('c')
            });

            setTimeout(function(){
                Anim.elem($('#intro'), 'fadeOut');    
                setTimeout(function() {
                    $('#intro').remove();
                }, 1000);
            },2000);
        }
    };
};

var FireBase = {
    data: [],
    count: 0,
    checked: 0,

    run: function() {
        var config = {
            apiKey: "AIzaSyCdNzMD2WYUWVgow0PJVLMi3UOvlLYj-90",
            authDomain: "gis-syste-kz.firebaseapp.com",
            databaseURL: "https://gis-syste-kz.firebaseio.com",
            projectId: "gis-syste-kz",
            storageBucket: "gis-syste-kz.appspot.com",
            messagingSenderId: "809270986840"
        };
        firebase.initializeApp(config);

        this.login('balgerim@gmail.com', '123456789');
    },

    login: function(myEmail, myPassword) {
        firebase.auth().signInWithEmailAndPassword(myEmail, myPassword).catch(function(error) {});
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log(user);
                email = user.email;
                uid = user.uid;
                console.log(uid);
                console.log(email);

                FireBase.getData();
            } else {
                console.log("Email is error");
            }
        });
    },

    writeData: function(data) {
        firebase.database().ref('data/uko/' + FireBase.data.length).set({
            name: data.name,
            val: data.val,
            url: data.url,
        });
    },

    getData: function() {
        return firebase.database().ref('/data/uko').once('value').then(function(snapshot) {
            FireBase.data = snapshot.val();
            FireBase.count = FireBase.data.length;
            console.log(FireBase.data, FireBase.count);

            FireBase.addObj();
        });
    },

    addObj: function() {
        var code = '';
        console.log(FireBase.data[1].name);
        for (var i = 0; i < FireBase.data.length; i++) {
            code += '<div class="sity-item button" key="' + i + '">' + FireBase.data[i].name + '</div>  ';
            console.log(FireBase.data[i].name);
        }

        $('#footer').html(code);
        FireBase.button();
        FireBase.onDataLoad();
    },

    button: function() {
        $('.sity-item').click(function() {
            $('#main-container').attr('src', FireBase.data[$(this).attr('key')].url);
            $('#info-title').html(FireBase.data[$(this).attr('key')].val);
            $('#info-head').html(FireBase.data[$(this).attr('key')].name);
            FireBase.checked = $(this).attr('key');
            Sound.stop();
        });

        $('#info-box, #send-box').draggable();

        $('#info-audio').click(function() {
            FireBase.getSounds(FireBase.checked);
        });

        var state = false;
        $('#send-title').click(function() {
            if (!state) {
                $('#send-content').css('display', 'inline');
                state = true;
            } else {
                $('#send-content').css('display', 'none');
                state = false;
            }
        });

        $('#send-btn').click(function() {
            if ($('#send-name').val().length != 0 && $('#send-url').val().length != 0 && $('#send-val').val().length != 0) {
                FireBase.writeData({
                    name: $('#send-name').val(),
                    url: $('#send-url').val(),
                    val: $('#send-val').val(),
                });

                $('#send-title').html('Объект добавлен, идет обновление!');
                $('#send-content').css('display', 'none');
                setTimeout(function(){
                    location.reload();
                },2000);
            } else {
                Anim.elem( $('#send-content'), 'shake' );
            }
        });
    },

    onDataLoad: function() {
        $('#main-container').attr('src', FireBase.data[0].url);
        $('#info-title').html(FireBase.data[0].val);
        $('#info-head').html(FireBase.data[0].name);
        this.getSounds(0);
    },

    getSounds: function(num) {
        var storageRef = firebase.storage().ref();

        var audioRef = storageRef.child('uko/' + num + '.mp3');
        audioRef.getDownloadURL().then(function(url) {
            Sound.stop();
            Sound.play(url);
        })
    },
};

var Anim = {
    elem: function(img, animType) {
        $(img).addClass("animated");
        $(img).addClass(animType);
        setTimeout(function() {
            $(img).removeClass("animated");
            $(img).removeClass(animType);
        }, 1000);
    },

    class: function(className, animName, delay) {
        var time = 0;
        className.each(function() {
            time += delay;
            var elem = $(this);
            setTimeout(function() {
                Anim.lib(elem, animName);
            }, time);
        });
    }
}

var Sound = {
    sound: null,
    soundArr: [],
    play: function(src) {
        this.sound = new Audio(src);
        this.sound.play();
        this.soundArr.push(this.sound);
    },

    stop: function() {
        for (var i = 0; i < Sound.soundArr.length; i++) {
            Sound.soundArr[i].pause();
        }

    },
}