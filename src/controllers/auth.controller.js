import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    /**Extraer los campos necesarios del cuerpo de la solicitud */
    const { name, email, password,lastName,phone,userType } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    /**Generar el payload object a la base de datos en mongo */
    const user = new User({
      name,
      email,
      lastName,
      phone,
      userType,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "Usuario creado con exito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};