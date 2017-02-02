// js for submitting a chat, getting screenname from hbrs
// js for creating a pair of users, and sending them to createsession
   $(document).ready(function(){
        firebase.initializeApp(config);
        var database = firebase.database();
        createChatRoom("lobby", 1000, user.displayName, database);
        $("#joinQueue").click(function(){
            $(this).hide().next("p").text("Please wait...pairing you with someone...");

            // add user.displayName to queue
            var queueRef = database.ref("queue");
            var meInQueueRef = queueRef.push(user.displayName);   
            meInQueueRef.onDisconnect().remove();

            //check to see if you can pair the user with someone else in the queue
            queueRef.on("value", function(snapshot){
                console.log(snapshot.numChildren() + " users in the queue");
                var foundMatch = false;
                snapshot.forEach(function(userInQueue){
                    var waitingUser = userInQueue.val();
                    if (!foundMatch && waitingUser != user.displayName){
                        createSession(waitingUser);
                        foundMatch = true;
                    }
                });
            });
        });

        function createSession(partnerName){
            console.log("create a session with user ", partnerName)
            $.ajax("/session/create", {
                data:{
                    method: "POST",
                    userId: user.displayName,
                    teammateId: partnerName
                }
            });
        }
   });