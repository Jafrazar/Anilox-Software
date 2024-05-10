<!DOCTYPE html>
<html lang="es">
<head>
<link rel="manifest" href="manifest.webmanifest">
<meta name="viewport" content="width=device-width, initial-scale=1" charset="UTF-8">
<title>Inicio - Ánilox Manager</title>
<style>
	body {font-family: Arial, Helvetica, sans-serif; text-align:center; margin-top: 12rem;}
/* 	      background-image: url("./images/anders_logo.png")} */
	
	form {border: 3px solid #f1f1f1; border-radius: 8px; width:25%; display: inline-block; background-color: white}
	/* Full-width input fields */
	input[type=text], input[type=password] {
	  width: 100%;
	  padding: 12px 12px;
	  margin: 8px 0;
	  display: inline-block;
	  border: 1px solid #bbb;
	  box-sizing: border-box;
	}
	
	input[type=password]:not(:placeholder-shown) {
	  font-family: 'pass', 'Roboto', Helvetica, Arial, sans-serif;
	  font-size: 85%;
	}
	
	/* Set a style for all buttons */
	button {
	  font-size: 100%;
	  background-color: #04AA6D;
	  color: white;
	  padding: 14px 20px;
	  margin: 8px 0;
	  border: none;
	  cursor: pointer;
	  width: 100%;
	}
	
	button:hover {
	  opacity: 0.8;
	}
	
	.container {
	  padding: 16px;
	  font-size: 120%;
	}
	
	span.psw {
	  justify-content: right;
	  float: center;
	  font-size: 90%;
	}
	
	/* Change styles for span on extra small screens */
	@media screen and (max-width: 300px) {
	  span.psw {
	     display: block;
	     float: none;
	  }
	}
	
</style>
</head>
<body>
	<br>
    <h2>Inicio de sesión</h2>
    <div style="background-color: white">
	<form action=HelloServlet method=post>  <%--  action="<%= request.getContextPath() %>/HelloServlet" method="post" --%>
    	<div class="container">
            <div style="display: flex; text-align: left;">
            	<label for="user"><b>Usuario</b></label><br>
            </div>
            
        	<input type="text" placeholder="Ingrese su usuario o correo electrónico" id="user" name="us" required><br><br>
        	
        	<div style="display: flex; text-align: left">
        		<label for="pass"><b>Contraseña</b></label><br>
        	</div>
        	
        	<input type="password" placeholder="Ingrese su contraseña" id="pass" name="pa" autocomplete="on" required><br>
        	
        	<%-- <button onclick="<% try {
            	String usua = request.getParameter("us"); String pass = request.getParameter("pa"); String a; String b;
            	Statement st = connection.createStatement();
                ResultSet rs = st.executeQuery("SELECT user_l, pass_l FROM login");
                
                while(rs.next()) {
                	System.out.println(rs.getString(1));
                	System.out.println(rs.getString(2));
                	if(usua!="" && rs.getString(1).equals(usua)) {
                		if(pass!="" && rs.getString(2).equals(pass)){
                			System.out.println("Ingreso Correcto");
                			response.sendRedirect(request.getContextPath() + "/index.jsp");
                		} 
                	}
                }
            } catch(SQLException ex) {
            	ex.printStackTrace();
            }
            %><%response.sendRedirect(request.getContextPath() + "/index.jsp"); %>">Ingresar</button><br> --%>
        	<button>Ingresar</button>
        	<div style="display: flex; align-text: left; padding-top: 4px; margin-bottom: -7px">
	        	<label>
	        		<input type="checkbox" checked="checked" name="remember">Recordarme
	        	</label>
        	</div>
    	</div>
		
		<div class="container" style="background-color:#f1f1f1">
		    <span class="psw">Olvidé mi <a href="password.jsp">contraseña</a></span><br><br>
		    <label style="font-size:90%">¿No tienes una cuenta? </label><span><a href="signup.jsp" style="font-size:90%">Regístrate</a></span>
		</div>
    </form>
    </div>
    <script>
//         function submitForm() {
//             var usuario = JSON.stringify(document.getElementById("user").value);
//             var contra = JSON.stringify(document.getElementById("pass").value);
<%--             <% try { --%>
//             	String usua = request.getParameter("us"); String pass = request.getParameter("pa"); String a; String b;
//             	Statement st = connection.createStatement();
//                 ResultSet rs = st.executeQuery("SELECT user_l, pass_l FROM login");
                
//                 while(rs.next()){
//                 	System.out.println(rs.getString(1));
//                 	System.out.println(rs.getString(2));
//                 	if(rs.getString(1).equals(usua)) {
//                 		if(rs.getString(2).equals("1234")){
//                 			System.out.println("Ingreso Correcto");
//                 			response.sendRedirect(request.getContextPath() + "/index.jsp");
//                 		} 
//                 	}
//                 }
//             } catch(SQLException ex) {
//             	ex.printStackTrace();
//             }
<%--             %> --%>
            // Send data to the backend
//             var xhr = new XMLHttpRequest();
//             xhr.open("POST", "/WebAppAnilox/HelloServlet", true);
//             xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//             xhr.onreadystatechange = function() {
//                 if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//                     // Handle the response from the backend
//                     console.log(xhr.responseText);
//                 }
//             };
//             xhr.send("usuario=" + usuario + "&contra=" + contra);
        
    </script>
</body>
</html>