var App = (function (window, document, $) {

    'use strict';

    var users = shuffle([
            'BrendanEich',
            'isaacs',
            'rdworth',
            'fat',
            'michalbe',
            'afabbro',
            'addyosmani',
            'joezimjs',
            'douglascrockford',
            'paulirish',
            'tj',
            'guille',
            'nzakas',
            'jeresig',
            'substack',
            'dherman',
            'creationix',
            'mrdoob',
            'codepo8',
            'rwaldron',
            'darkwing',
            'bevacqua',
            'sindresorhus',
            'getify',
            'ericelliott',
            'aaronfrost',
            'jhusain',
            'ryanflorence',
            'gaearon',
            'rauschma',
            'sarasoueidan',
            'rmurphey',
            'bitchwhocodes',
            'noopkat',
            'sdras',
            'rachelnicole',
            'jennschiffer',
            'kosamari',
            'cassidoo'
        ]),
        userIsDone,
        URL = 'https://api.github.com/';

    return {
        // Init function
        init: function () {
            this.getGithubUsers();
            this.getGithubContrib();
            $('img.lazy').lazyload();
        },
        // Getting and appending users of github
        getGithubUsers: function () {
            var i = 0,
                length = userIsDone = users.length,
                str = '',
                $whoto;

            // Callback function
            function cb(result) {
                userIsDone -= 1;
                str += '<div class="user"><a href="' + result.html_url +
                    '"><img height="80" width="80" class="lazy" data-original="' +
                    result.avatar_url + '"><span>' + result.name +
                    '</span></a></div>';
                // Checking if all callbacks were called
                if (userIsDone === 0) {
                    $whoto = $('#whotofollow .users');
                    $whoto.append(str);
                    $whoto.find('img.lazy').lazyload();
                }
            }

            // Doing the requests for each user
            for (; i < length; i += 1) {
                $.get(URL + 'users/' + users[i] +
                    '?client_id=5feee647eb6cc3d1f984&client_secret=9ed0c553e278d047a264c3abd26f385144d51ac4',
                    cb);
            }
        },
        // Getting the project's contributors
        getGithubContrib: function () {
            var $footer;

            // Callback function
            function cb(result) {
                var i = 0,
                    length = result.length,
                    str = '',
                    obj;

                for (; i < length; i += 1) {
                    obj = result[i];

                    str += '<div class="user"><a href="' + obj.html_url +
                        '"><img width="80" height="80" class="lazy" data-original="' + obj
                        .avatar_url + '"><span>' + obj.login +
                        '</span></a></div>';
                }

                $footer = $('#footer .users');
                $footer.append(str);
                $footer.find('img.lazy').lazyload();
            }

            // Doing the request
            $.get(URL +
                'repos/braziljs/js-the-right-way/contributors?client_id=5feee647eb6cc3d1f984&client_secret=9ed0c553e278d047a264c3abd26f385144d51ac4',
                cb)
        }
    }

}(window, document, jQuery));

// Shuffle the elements of an array
// Taken from stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Starting the Application
App.init();
