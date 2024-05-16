import random
import string
import mysql.connector

# Generar una licencia alfanumérica aleatoria de 15 caracteres
def generar_licencia():
    caracteres_letras = string.ascii_letters
    caracteres_numericos = string.digits
    caracteres_especiales = string.punctuation

    licencia_alfanumerica = [random.choice(caracteres_letras) for _ in range(6)] + [random.choice(caracteres_numericos) for _ in range(7)]
    licencia_especial = [random.choice(caracteres_especiales) for _ in range(2)]

    licencia = licencia_alfanumerica + licencia_especial

    random.shuffle(licencia)

    return ''.join(licencia)

licencia = generar_licencia()
# Conectar a la base de datos MySQL
conexion = mysql.connector.connect(
    host="database-1.cspwdfignp82.sa-east-1.rds.amazonaws.com",
    user="admin",
    password="104#55Fppl2",
    database="ANILOX"
)
print(licencia)
# Crear una tabla llamada "LICENCIAS" si no existe
cursor = conexion.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS licencias (licencia VARCHAR(15))")
cursor.execute("INSERT INTO licencias (usersLimit, usersUsed, licenseHolder, licenseNumber) VALUES (3, 0, 'PackPlast Envolturas', %s)", (licencia,))

# # Confirmar los cambios y cerrar la conexión
conexion.commit()
conexion.close()