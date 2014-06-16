$(document).on("tap", "#share-facebook", function(event) {
    event.preventDefault();

    FB.login(function(response) {
      if (response.status === 'connected') {
        
      }
    });

    // FB.getLoginStatus(function(response) {
    //   if (response.status === 'connected') {
    //     console.log('Logged in.');
    //   }
    //   else {
    //     FB.login();
    //   }
    // });

    // FB.api(
    //     "/me/photos",
    //     "POST",
    //     {
    //         "object": {
    //             "url": localStorage.getItem("full_canvas_render")
    //         }
    //     },
    //     function (response) {
    //       if (response && !response.error) {
    //         console.log(response);
    //       }
    //     }
    // );
});