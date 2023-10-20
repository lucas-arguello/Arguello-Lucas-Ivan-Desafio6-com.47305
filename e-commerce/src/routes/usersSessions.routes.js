import { Router } from "express";
import { usersServiceMongo } from "../dao/index.js";

const router = Router();

//logueo al usuario se admin o usuario
router.post('/login', async (req, res) => {
    try {
        const loginUser = req.body;
        console.log(loginUser.email, loginUser.password);

        if(loginUser.email === 'admin@coder.com' && loginUser.password === 'admin') {
            req.session.email = loginUser.email
            req.session.role = 'admin'
            return res.redirect('/');
        } else {
            
            const user = await usersServiceMongo.getUser(loginUser.email);
            //verifico si el usuario existe
            if(!user) {
                return res.render('login', {error: 'Usuario no registrado'});
            }
            //verifico usuario y contrasena coincida con las de la base
            if(user.password !== loginUser.password) {
                return res.render('login', {error: 'Credenciales inválidas'});
            }
            //si todo es ok 
            req.session.first_name = user.first_name;
            req.session.last_name = user.last_name;
            req.session.age = user.age;
            req.session.email = user.email;
            req.session.role = user.role;

            return res.redirect('/');
        }
    } catch (error) {
        return res.status(500).render('login', {error: 'No se pudo iniciar sesión para este usuario'});
    }
});

//registro al ususario
router.post('/register', async (req, res) => {
    try {
        const newUser = req.body;
        const result = await usersServiceMongo.createUsers(newUser);
        return res.render('login', {message: 'Usuario registrado con éxito'});
    } catch (error) {
        return res.status(500).render('register', {error: 'No se pudo registrar el usuario'});
    }
});

//para eliminar la seccion
router.get('/logout', (req, res) => {
    try {
        req.session.destroy(err => {
            if(err) return res.status(500).render('profile', {error: 'No se pudo cerrar sesión'});
            //una vez cerrada la sesion lo redirige a login
            return res.redirect('/');
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export { router as usersSessionsRouter }


