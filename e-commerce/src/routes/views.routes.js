import {Router} from "express";//importamos "routes" desde la libreria de express
//import { productsService } from "../dao/index.js";
import { productsServiceMongo } from "../dao/index.js";
import { cartsServiceMongo } from "../dao/index.js";

const router = Router();

//ruta para la vista home de todos los productos
router.get("/", async (req,res)=>{
    try{
        //si no esta logeado lo redirige a login
        if(!req.session.email){
            res.render('login', { error: 'Para navegar debe iniciar session'})
        }else{   
        
            const products = await productsServiceMongo.getProducts();
                //console.log(products)
                if(products.length === 0){
                    res.render("home",{ message: 'No hay productos'});

                    throw new Error('No hay productos');
                }
                //aca renderizamos la vista del "home", y le pasamos un objeto con los datos de nuestros productos y los enviamos al "home.hbs".
                res.render("home", { 
                    products : products,
                    userFirst_Name: req.session.first_name,
                    userLast_Name: req.session.last_name,
                    userRole: req.session.role
                });
            }


        } catch (error) {
            res.status(500).json({ message: error.message }); 
        }

});

//ruta para login
router.get('/login', (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//ruta para register
router.get('/register', (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//ruta para el perfil de usuario
router.get('/profile', (req, res) => {
    try {
        if(!req.session.email){
            res.render('login', { error: 'Para navegar debe iniciar session'})
        }else{
            res.render('profile', {
                userFirst_Name: req.session.first_name,
                userLast_Name: req.session.last_name,
                userAge: req.session.age,
                userEmail: req.session.email,
                userRole: req.session.role
    
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//ruta para ver los productos en tiempo real y eliminar productos. 
router.get("/realtimeproducts", (req,res)=>{
    try{    
            if(!req.session.email){
                res.render('login', { error: 'Para navegar debe iniciar session'})
                }else{
            
                    //aca renderizamos la vista del "realtime".
                    res.render("realtime")
                    }
        } catch (error) {
            res.status(500).json({ message: error.message });        
        }

});

//ruta que esta vinculada al servidor de "websocket"
router.get("/chats", (req,res)=>{
    try{    
            if(!req.session.email){
                res.render('login', { error: 'Para navegar debe iniciar session'})

                }else{
        
                //aca renderizamos la vista del "realtime".
                res.render("chats")
                }

        } catch (error) {
            res.status(500).json({ message: error.message });        
        }

});

//pagiante// localhost:8080?page=1 ... 2 ...3 ..etc
router.get('/products', async (req, res) => {
    try {

        if(!req.session.email){
            res.render('login', { error: 'Para navegar debe iniciar session'})
            }else{

                const { limit= 4, page=1 } = req.query;
                const query = {};
                const options = {
                    limit,
                    page,
                    sort: { price: 1 },   
                    lean: true
                }
                const result = await productsServiceMongo.getProductsPaginate(query, options);
                //console.log('products', result);
                //obtengo la ruta del servidor 
                const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                const dataProducts = {
                    status:'success',
                    payload: result,
                    totalPages: result.totalPages,
                    prevPage: result.prevPage ,
                    nextPage: result.nextPage,
                    page: result.page,
                    pagingCounter: result.pagingCounter,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.hasPrevPage ? 
                    `${baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`)}` 
                    : null,
                    nextLink: result.hasNextPage ? baseUrl.includes("page") ? 
                    baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) :
                    baseUrl.concat(`?page=${result.nextPage}`) : null

                }
                console.log(result)
                // console.log(dataProducts.payload)
                // console.log('Data del console log:', dataProducts.nextLink, dataProducts.prevLink)
                res.render('productsPaginate', dataProducts);
                }
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
})

//ruta hardcodeada localhost:8080/cart/652832e702a5657f7db4c22e
router.get('/cart/:cid', async (req, res) => {
    const cartId = '652832e702a5657f7db4c22e'
    try {
        const cart = await cartsServiceMongo.getCartsId(cartId);
        //console.log('Prueba en consola', cart);
        if(!cart){
            return res.status(404).send('No se pudo encontrar el carrito');
        }else{
            //console.log('Carrito en consola ',cart.products);
            res.status(200).render('carts', { products: cart.products });
            
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

export {router as viewsRouter};//lo exportamos para poder importarlo en "app.js".
