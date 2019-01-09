app.controller('indexController',['$scope',"indexFactory",($scope,indexFactory)=>
{   $scope.messages=[];
   $scope.players={};
    $scope.init=()=>{
        const username=this.prompt("enter username");
        if(username){
            initSocket(username);
        }else{
            return false;
        }
    };
    function initSocket(username) {
       indexFactory.connectSocket("http://localhost:3000",{
        reconnectionAttempts:3,
        reconnectionDelay:500,
      
    }).then((socket)=>{
        socket.emit("newUser",{username})
        socket.on('newUser',(data)=>{
           const messageData={
               type:{
                   code:0,//0 client ,  1 server 
                    status:1 //0 disconnect , 1 login                    
               },
               username:data.username
           };
           console.log(messageData);
           
            $scope.messages.push(messageData);
            $scope.$apply();
        });
        socket.on('initPlayers',(players)=>{
            $scope.players=players;
            $scope.$apply();
        })
        socket.on('disUser',(data)=>{
            const messageData={
                type:{
                    code:0,//0 client ,  1 server 
                    status:0 //0 disconnect , 1 login                    
                },
                username:data.username
            };
            $scope.messages.push(messageData);
            $scope.$apply();
        });
        let animate=false;
        $scope.onClickPlayer=($event)=>{
            console.log($event.offsetX);
            console.log($event.offsetY);    
            if(!animate){
            $('#'+socket.id).animate({"left": $event.offsetX-40,"top": $event.offsetY-40},()=>{
                animate=false;
            });
            animate=true;
        }
        }
          
    })
    .catch(err=>{
        console.log(err);
        
    })

}
}])