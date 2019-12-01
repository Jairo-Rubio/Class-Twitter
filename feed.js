export const view = function () {
    return $(`
    <div id="root">
        <section id="header"> 
            <div style="color:white">Tha TL Juu Hearddd</div>
            <div>
                <button class="refresh_button button is-small is-rounded is-light is-info">Refresh</button>
                <button class="post_button button is-small is-rounded is-light is-info">New Tweet</button>
            </div>
        </section>

        <section id="timeline">
            <div id="tweets">
            <div>
        </section>
    </div>
    `);
}

export async function getTweets() {
    const result = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
    });
    for (let i = 0; i < 50; i++) {
        let tweet = result.data[i];
        $('#tweets').append(renderTweets(tweet));
    }

};

export const renderTweets = function (tweet) {
    // console.log(tweet.id);
    const tweet_view = $(`
        <div class="tweet_view" id="${tweet.id}">
        </div>
    `);
    const time = new Date(tweet.updatedAt).toLocaleTimeString("en-US") + "   " + new Date(tweet.updatedAt).toLocaleDateString("en-US");
    const interactions = $(`
        <div tweetId="${tweet.id}" tweetBody= "${tweet.body}" tweetAuthor= "${tweet.author}" replycount="${tweet.replyCount}">
            <div class="user_name">${tweet.author}</div>
            <br>
            <div>${tweet.body}</div>
            <br>
            <p class="time">${time}</p>
        </div>`
    );
    interactions.append($(`<button class="retweet_button button is-small is-rounded is-light is-info">${tweet.retweetCount} Retweets</button>`));
    if (tweet.isMine) {
        interactions.append($(`<button class="like_button button is-small is-rounded is-light is-info">${tweet.likeCount} Likes</button>`));
        interactions.append($(`<button class="edit_button button is-small is-rounded is-light is-info">Edit</button>`));
        interactions.append($(`<button class="delete_button button is-small is-rounded is-light is-info">Delete</button>`));
        
    } else {
        if (tweet.isLiked) {
            interactions.append($(`
                <button class="unlike_button button is-small is-rounded is-light is-danger" type="submit">${tweet.likeCount} Likes</button>   
            `));
        } else {
            interactions.append($(`
                <button class="like_button button is-small is-rounded is-light is-info" type="submit">${tweet.likeCount} Likes</button>
            `));
        }
        if(tweet.replyCount > 0){
            interactions.append($(`<button class="reply_button button is-small is-rounded is-light is-info">${tweet.replyCount} Replies</button>`)); 
        }else{
            interactions.append($(`<button class="reply_button button is-small is-rounded is-light is-info">Reply</button>`));
        }  
    }
    tweet_view.append(interactions);
    return tweet_view;

};


export const handleTweetButtonPress = function (event) {
    event.preventDefault();
    const tweets = $('#tweets');
    tweets.empty();
    let post = $(`
    <div class="tweet_view">
        <div class="post_form">
            <div class="user_name">New Tweet</div>
            <br>
            <form>
                <textarea rows="3" cols="50" id="post_body" placeholder="Whatchu thinking bout my g?"></textarea>              
                <footer>
                        <button class="button is-small is-rounded is-light is-info" id="post_submit" type="submit">Save</button>
                        <button class="button is-small is-rounded is-light is-info" id="cancel">Cancel</button>
                </footer>
            </form>
        </div>
    </div>
`);
    tweets.append(post);
}

export const handleTweetSubmitButtonPress = async function (event) {
    event.preventDefault();
    const body = $('#post_body').val();
    const result = await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            body: "" + body,
        }
    });

    reloadTweets();
}

export const handleLikeButtonPress = async function (event) {
    event.preventDefault();
    const id = event.target.parentNode.getAttribute('tweetId');

    const result1 = await axios({
        method: 'put',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id + '/like',
        withCredentials: true,
    });

    reloadTweets();
}

export const handleUnlikeButtonPress = async function (event) {
    event.preventDefault();
    const id = event.target.parentNode.getAttribute('tweetId');

    const result = await axios({
        method: 'put',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id + '/unlike',
        withCredentials: true,
    });

    reloadTweets();
}
export const handleEditButtonPress = async function (event) {
    event.preventDefault();
    const id = event.target.parentNode.getAttribute('tweetId');
    const tweet_view = $('#' + id);
    tweet_view.empty();

    const result = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id,
        withCredentials: true,
    });
    let tweet = result.data;
    //console.log(tweet.replies)
    let editTweet = $(`
    <div class="edit_form">
        <div class="user_name">${tweet.author}</div><br>
        <form>
            <textarea rows="2" cols="70" id="edit_body">${tweet.body}</textarea>
            <footer>
                <button class="button is-small is-rounded is-light is-info" id="edit_submit" tweetId="${tweet.id}" type="submit">Save</button>
                <button class="button is-small is-rounded is-light is-info" id="cancel">Cancel</button>
            </footer>
        </form>
    </div>
    `);
    tweet_view.append(editTweet);
}

export const handleEditSubmitButtonPress = async function (event) {
    event.preventDefault();
    const id = event.target.getAttribute('tweetId');
    const update_body = $('#edit_body').val();

    const result = await axios({
        method: 'put',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id,
        withCredentials: true,
        data: {
            "body": "" + update_body,
        },
    });

    reloadTweets();
}


export const handleRetweetButtonPress = function (event) {
    event.preventDefault();
    const id = event.target.parentNode.getAttribute('tweetId');
    let orig = event.target.parentNode.getAttribute('tweetBody');
    let author = event.target.parentNode.getAttribute('tweetAuthor');
    const tweet_view = $('#' + id);
    //let rtct = event.target.parentNode.getAttribute('rtcount');
    //console.log(rtct);
    tweet_view.append((`
        <div class="retweet_form">
            <form>
                <div class="user_name"></div>
                <br>
                <textarea rows="3" cols="50" id="retweet_body" placeholder="Retweet:"></textarea>              
                <footer>
                    <button class="button is-small is-rounded is-light is-info" id="retweet_submit" tweetId="${id}" tweetBody="${orig}" tweetAuthor="${author}" type="submit">Save</button>
                    <button class="button is-small is-rounded is-light is-info" id="cancel">Cancel</button>
             </footer>
            </form>
        </div>
    `));
}

export const handleRetweetSubmitButtonPress = async function (event) {
    event.preventDefault();
    let id = event.target.getAttribute('tweetId');
    let orig = event.target.getAttribute('tweetBody');
    let author = event.target.getAttribute('tweetAuthor');
    const retweet = $('#retweet_body').val();
    let retweet_body = retweet + " Retweet: @" + author + ": " + orig;
    const result = await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "retweet",
            "parent": id,
            "body": retweet_body,
        },
    });

    reloadTweets();
}




export const handleReplyButtonPress = function (event) {
    event.preventDefault();
    const id = event.target.parentNode.getAttribute('tweetId');
    let orig = event.target.parentNode.getAttribute('tweetBody');
    let author = event.target.parentNode.getAttribute('tweetAuthor');
    const replies = event.target.parentNode.getAttribute('replycount');
    const tweet_view = $('#' + id);
    console.log(replies);
    tweet_view.append((`
        <div class="reply_form">
            <form>
                <div class="user_name"></div>
                <br>
                <textarea rows="3" cols="50" id="reply_body" placeholder="Reply to: ${author}"></textarea>              
                <footer>
                    <button class="button is-small is-rounded is-light is-info" id="reply_submit" tweetId="${id}" tweetBody="${orig}" tweetAuthor="${author}" type="submit">Send</button>
                    <button class="button is-small is-rounded is-light is-info" id="cancel">Cancel</button>
             </footer>
            </form>
        </div>
    `));
}

export const handleReplySubmitButtonPress = async function (event) {
    event.preventDefault();
    let id = event.target.getAttribute('tweetId');
    let orig = event.target.getAttribute('tweetBody');
    let author = event.target.getAttribute('tweetAuthor');
    const reply = $('#reply_body').val();
    let reply_body = "Reply to @" + author + ": " + orig +" "+reply;
    const result = await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "reply",
            "parent": id,
            "body": reply_body,
        },
    });
    reloadTweets();
}

export const handleDeleteButtonPress = async function (event) {
    event.preventDefault();
    const id = event.target.parentNode.getAttribute('tweetId');

    const result = await axios({
        method: 'delete',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id,
        withCredentials: true,
    });

    reloadTweets();
}



export const handleRefreshButtonPress = function (event) {
    event.preventDefault();
    reloadTweets();
}




export function reloadTweets() {
    let tweets = $('#tweets');

    tweets.empty();
    getTweets();
}
export const loadTweetsIntoDOM = function () {
    // Grab a jQuery reference to the root HTML element
    let $root = $('#root');
    $root.empty();
    $root.append(view());
    getTweets();
    $root.on('click', '.like_button', handleLikeButtonPress);
    $root.on('click', '.unlike_button', handleUnlikeButtonPress);
    $root.on('click', '.edit_button', handleEditButtonPress);
    $root.on('click', '.retweet_button', handleRetweetButtonPress);
    $root.on('click', '.delete_button', handleDeleteButtonPress);
    $root.on('click', '.post_button', handleTweetButtonPress);
    $root.on('click', '.refresh_button', handleRefreshButtonPress);
    $root.on('click', '#edit_submit', handleEditSubmitButtonPress);
    $root.on('click', '#retweet_submit', handleRetweetSubmitButtonPress);
    $root.on('click', '#post_submit', handleTweetSubmitButtonPress);
    $root.on('click', '.reply_button', handleReplyButtonPress)
    $root.on('click', '.reply_submit', handleReplySubmitButtonPress)
};



/**
 * Use jQuery to execute the loadHeroesIntoDOM function after the page loads
 */
$(function () {
    loadTweetsIntoDOM();
});