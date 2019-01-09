app.controller('indexController',['$scope',"indexFactory",($scope,indexFactory)=>
{   $scope.messages=[];
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
               type:0,
               username:data.username
           };
           console.log(messageData);
           
            $scope.messages.push(messageData);
            $scope.$apply();
        })
          
    })
    .catch(err=>{
        console.log(err);
        
    })

}
}])