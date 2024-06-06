<!DOCTYPE html>
<html lang="es">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" charset="UTF-8">
<title>Olvidé mi contraseña - Anders</title>
<style>
 body {
 	-webkit-font-smoothing: antialiased;
 	font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
 	-webkit-text-size-adjust: 100%;
 	text-size-adjust: 100%;
 	background-color: #F0F0F0;
 }

*, :after, :before {
    box-sizing: border-box;
}

p {
	margin-bottom: 1rem;
	display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
}

.CajaReset {
	box-shadow: none;
	display: block;
	border-radius: 4px;
	left: 50%;
    max-height: 100%;
    max-width: 100%;
    position: absolute;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 478px;
    z-index: 150;
}

.Parrafo {
	margin-top: 36px;	
}

.ResetPassword {
	background-color: #fff;
    border: 1px solid #e3e3e3;
    border-radius: 16px;
    font-family: Roboto;
    height: 100%;
    left: 0;
    padding: 48px;
    position: relative;
    text-align: left;
    top: 0;
    width: 100%;
    display: block;
}

.ResetPassword h1 {
	color: #282a35;
    font-size: 29px;
    font-weight: 700;
    margin: 0;
}

.CajaGrandeEmail {
	position: relative;
	display: flex;
	flex-direction: column;
	font-family: Roboto;	
}

.CajaLabel {
	align-items: flex-end;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-family: Roboto;
    text-align: left;
}

.CajaInput {
	position: relative;
	display: block;
	font-family: Roboto;
	text-align: left;
}

.EmailInput {
	width: 100%;
	font-family: Roboto;
    font-size: 14px;
    background-color: #fff;
    border: 1px solid #ced4da;
    border-radius: 4px;
    margin: 6px 0;
    padding: 14px;
    line-height: inherit;
    writing-mode: horizontal-tb !important;
}

.Solicitud {
	margin-top: 10px;
    position: relative;
    top: 6px;
    width: 100%;    
}

.BotonReset {
 	background-color: #e2e8ea; 
    color: #798488; 
    width: 100%; 
    border: 0; 
    border-radius: 25px; 
    cursor: pointer; 
    display: inline-block; 
    font-family: Source Sans Pro,sans-serif; 
    font-size: 18px; 
    font-stretch: normal; 
    font-style: normal; 
    font-weight: 600; 
    height: 50px; 
    letter-spacing: normal; 
    line-height: 1.17; 
    margin: 0; 
    padding-left: 40px; 
    padding-right: 40px; 
    position: relative; 
    text-align: center; 
    text-decoration: none; 
    white-space: nowrap; 
} 

.Regresar {
	margin-top: 18px;
    text-align: center;
    width: 100%;   
}

.Regresar a{
	color: #282a35;
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    text-align: center;
    text-decoration: none;    
}

</style>
</head>

<body>
	<%	
	Properties props = new Properties();
	props.put("mail.smtp.host", "smtp.office365.com");
	props.setProperty("mail.smtp.starttls.enable", "true");
	props.put("mail.smtp.ssl.trust", "smtp.office365.com");
	props.setProperty("mail.smtp.port", "587");
	props.setProperty("mail.smtp.user", "franco.delalcazar@qanders.com");
	props.setProperty("mail.smtp.auth", "true");
	
	Session sesion = Session.getDefaultInstance(props);
	
	String correoRemitente = "frank43_8@hotmail.com";
	String passRemitente = "104#55Fppl2";
	String asunto = "RECUPERACIÓN DE CONTRASEÑA";
	String mensaje = "Su contraseña es: " + "ASD123.\n\n"
			+ "Por favor no responder a este mensaje automático.";

	MimeMessage message = new MimeMessage(sesion);
	message.setFrom(new InternetAddress(correoRemitente));
	%>

	<div class="CajaReset">
		<div class="ResetPassword">
			<h1>Recuperar contraseña</h1>
			<p class="Parrafo">Si el correo existe, le enviaremos un e-mail para recuperar su contraseña.
			<p class="Invi" style="color: white; user-select: none">*Se realizó el envío a su correo de manera exitosa.
			<form method="post">
				<div>
					<div class="CajaGrandeEmail">
						<div class="CajaLabel">
							<label for="recoverEmail">Email</label>
						</div>
						
						<div class="CajaInput">
							<input class="EmailInput" type="email" id="recoverEmail" name="recuperar" aria-label="Email" onkeyup="EnableDisable(this)" required>
						</div>
					</div>
				</div>
			<div class="Solicitud">
				<div>
					<button class="BotonReset" type="submit" onClick="SubmitForm()" disabled=disabled><span>Recuperar contraseña</span></button>
					<div class="Regresar"><a href="index.jsp">Regresar a Inicio</a></div>
				</div>
			</div>
			</form>
			
		</div>
	</div>
	<script>
	// El script solo se corre al iniciar el programa, no está dentro de un bucle. Para que se ejecute un script de un input en tiempo real al clickearlo
	// se debe agregar la propiedad onkeyup junto con la función que se quiere ejecutar

		function EnableDisable(recoverEmail) {
			var btnReset = document.getElementsByTagName("Button")[0];
			if (recoverEmail.value != "") {
				btnReset.style.backgroundColor = "#04AA6D";
				btnReset.disabled = false
				btnReset.style.color = 'white';
			} else{
				btnReset.style.backgroundColor = "#e2e8ea";
				btnReset.disabled = true
			}
		}
		
		function SubmitForm(){
			<%
			String recu = request.getParameter("recuperar");
			if (session.getAttribute("PARAM") == null) {
			    System.out.println("This is a NEW request");
			    session.setAttribute("PARAM", request.getParameter("recuperar"));
			} else if (session.getAttribute("PARAM").toString().equalsIgnoreCase(recu)) {
			    System.out.println("This is a REFRESH");
			    session.removeAttribute("PARAM");
			} else {
			    System.out.println("This is a NEW request");
			    session.setAttribute("PARAM", request.getParameter("precu"));
			}
			%>
			<%String jspvar="a";%>			
			if(document.querySelector('input').value != null){
				<%
				if(recu != null){
					String usuarioR = request.getParameter("recuperar");
					String correoReceptor = usuarioR;
					System.out.println(correoReceptor);
		            try {	    			
		    			message.addRecipient(Message.RecipientType.TO, new InternetAddress(correoReceptor));
		    			message.setSubject(asunto);
		    			message.setText(mensaje);
		    			Transport t = sesion.getTransport("smtp");
		    			t.connect(correoRemitente, passRemitente);
		    			t.sendMessage(message, message.getRecipients(Message.RecipientType.TO));
		    			jspvar = "a";
		    			System.out.println("Envío exitoso");

			    	} catch (Exception e) {
			    		System.out.println(e);
			    		e.printStackTrace();
			    		System.out.println("Error en el envío...");
			    		jspvar = "b";
			    	}
				}
				else{
					jspvar ="c";
				}
		    	%>
		    	myvar = "<%out.print(jspvar);%>";
			}
			
 	    	if(myvar == "c"){
 		    	document.querySelector(".Invi").style.color = 'green';
 	    	}
 	    	else if(myvar == "b"){
 	    		document.querySelector(".Invi").innerHTML = "Error en el envío.";
 	    		document.querySelector(".Invi").style.color = 'red';
 	    	}
		}
	</script>
</body>
</html>