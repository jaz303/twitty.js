(function(exports) {

  var INTERVALS = [[86400, 'day'], [3600, 'hour'], [60, 'minute'], [1, 'second']],
      INTENT    = 'https://twitter.com/intent/';

  var nextID    = 0;

  function Tweet(stuff) {
    for (var k in stuff) this[k] = stuff[k];
  };
  
  Tweet.prototype = {
    linkify: function() {
      return this.text.replace(/(https?:\/\/[^\s]+)/g,  '<a href="$1">$1</a>')
                      .replace(/#(\w+)/g,               '<a href="http://twitter.com/search/%23$1">#$1</a>')
                      .replace(/@(\w+)/g,               '<a href="http://twitter.com/$1">@$1</a>');
    },

    permaLink: function() { return 'https://twitter.com/' + this.user.screen_name + '/status/' + this.id; },
    replyLink: function() { return INTENT + 'tweet?in_reply_to=' + this.id; },
    retweetLink: function() { return INTENT + 'retweet?tweet_id=' + this.id; },
    favouriteLink: function() { return INTENT + 'favorite?tweet_id=' + this.id; },

    relativeTimeInWords: function() {
      var diff = Math.floor((new Date() - new Date(this.created_at)) / 1000);

      if (diff < 0) return '???';

      for (var i = 0; i < INTERVALS.length; i++) {
        var val = diff / INTERVALS[i][0];
        if (val >= 2)   return '' + Math.floor(val) + ' ' + INTERVALS[i][1] + 's ago';
        if (val >= 0.8) return '1 ' + INTERVALS[i][1] + ' ago';
      }
    }
  };

  function Twitty() {}
  Twitty.prototype = {
    getUserTimeline: function(screenName, callback) {
      var localCallback = function(tweets) {
        tweets = tweets || [];
        for (var i = 0; i < tweets.length; i++) {
          tweets[i] = new Tweet(tweets[i]);
        }
        callback(tweets);
      }

      var callbackName  = '_twitter_cb_' + (nextID++);
      window[callbackName] = localCallback;

      var script = document.createElement('script');
      script.src = "http://twitter.com/statuses/user_timeline/" + screenName + ".json?callback=" + callbackName + "&count=5&include_rts=1";
      document.body.appendChild(script);
    }
  }

  exports.Twitty = Twitty;

})(this);