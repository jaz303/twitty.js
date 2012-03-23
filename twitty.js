(function(exports) {
  
  var INTERVALS = [[86400, 'day'], [3600, 'hour'], [60, 'minute'], [1, 'seconds']],
      INTENT    = 'https://twitter.com/intent/';
  
  var nextID    = 0;
      
  var tweetMethods = {
    linkify: function() {
      return this.text.replace(/@(\w+)/g, function() {
        return "<a href='http://twitter.com/" + RegExp.$1 + "'>@" + RegExp.$1 + "</a>";
      }).replace(/(https?:\/\/[^\s]+)/g, function() { // regex needs work
        return "<a href='" + RegExp.$1 + "'>" + RegExp.$1 + "</a>";
      });
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
        console.log(tweets);
        for (var i = 0; i < tweets.length; i++) {
          tweets[i].prototype = tweetMethods;
          tweets[i].__proto__ = tweetMethods;
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