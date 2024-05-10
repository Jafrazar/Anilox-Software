package servlets;

import java.io.IOException;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class PassEmailServlet
 */
@WebServlet("/PassEmailServlet")
public class PassEmailServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public PassEmailServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		// response.getWriter().append("Served at: ").append(request.getContextPath());
		System.out.println("Received from GET method");

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		System.out.println("Received from POST method");
		String usuarioR = request.getParameter("recuperar");
		try {
			System.out.println("0");
			Properties props = new Properties();
			props.setProperty("mail.smtp.host", "smtp.gmail.com");
			props.setProperty("mail.smtp.starttls.enable", "true");
			props.setProperty("mail.smtp.port", "587");
			props.setProperty("mail.smtp.auth", "true");

			Session session = Session.getDefaultInstance(props);

			String correoRemitente = "francodel380@gmail.com";
			String passRemitente = "cfzdxpsbcaqjyfux";
			String correoReceptor = usuarioR;
			System.out.println("7");
			String asunto = "RECUPERACIÓN DE CONTRASEÑA";
			String mensaje = "Su contraseña es: " + "ASD123.\n\n" + "Por favor no responder a este mensaje automático.";
			/*
			 * String mensaje2 = "<p>Hola,</p>" + "Has solicitado cambiar tu contraseña." +
			 * "Haga clic en el enlace de abajo para cambiar su contraseña:" + "<a href=\""
			 * + "resetPasswordLink" + "\">Cambiar mi contraseña</a>";
			 */

			MimeMessage message = new MimeMessage(session);
			message.setFrom(new InternetAddress(correoRemitente));

			message.addRecipient(Message.RecipientType.TO, new InternetAddress(correoReceptor));
			message.setSubject(asunto);
			message.setText(mensaje);

			Transport t = session.getTransport("smtp");
			t.connect(correoRemitente, passRemitente);
			t.sendMessage(message, message.getRecipients(Message.RecipientType.TO));
			t.close();
			System.out.println("Envío exitoso");

		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}
