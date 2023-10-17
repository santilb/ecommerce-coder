export function isAuth(req, res, next) {

    if (req.isAuthenticated()) {
      console.log("usuario autenticado");
      return next();
    }
    res.redirect("/auth/login");
  }
  
  export function isUser(req, res, next) {
    console.log(req.user);
    if (req.user?.role === "user") {
      console.log("es role = user");
      return next();
    }
    return res.status(401).render("error", {
      errorMessage:
        "Error de autorización. No tienes permiso para acceder al recurso solicitado",
    });
  }
  
  export function isAdmin(req, res, next) {
    console.log(req.user);
    if (req.user?.role === "admin") {
      console.log("es role = admin");
      return next();
    }
    return res.status(401).render("error", {
      errorMessage:
        "Error de autorización. No tienes permiso para acceder al recurso solicitado",
    });
  }
  
  export function isCartOwner(req, res, next) {
    if (req.session?.user.cart == req.params.cid) {
      return next();
    }
    return res.status(403).render("error", {
      errorMessage:
        "Error de autorización. No tienes permiso para acceder al recurso solicitado",
    });
  }