function validateForm()                                    
{ 
    var fname = document.forms["myForm"]["fname"];
    var lname = document.forms["myForm"]["lname"];                  
    var message = document.forms["myForm"]["subject"];   
   
    if (fname.value == "")                                  
    { 
        document.getElementById('errorname').innerHTML="Please enter a valid input";  
        fname.focus(); 
        return false; 
    }else{
        document.getElementById('errorname').innerHTML="";  
    }

    if (lname.value == "")                                  
    { 
        document.getElementById('errorname').innerHTML="Please enter a valid input";  
        lname.focus(); 
        return false; 
    }else{
        document.getElementById('errorname').innerHTML="";  
    }
       
    if (message.value == "")                           
    {
        document.getElementById('errormsg').innerHTML="Please enter a valid message"; 
        message.focus(); 
        return false; 
    }else{
        document.getElementById('errormsg').innerHTML="";  
    }
   
    return true; 
}