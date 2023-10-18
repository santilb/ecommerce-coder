/*const createCart = () => {
  console.log("🛒 Creando tu carrito...");
  if (!localStorage.getItem("funcionEjecutadaSoloUnaVez")) {
    fetch("/carts", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        let myCart = data.payload;
        localStorage.setItem("myCart", JSON.stringify(myCart));
        localStorage.setItem("cartId", JSON.stringify(myCart._id));
      })
      .catch((err) => console.log(err));
  }
};*/

const getCurrentUser = () => {

    fetch("/auth/current", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        const user = data;
        console.log("current user", user);
        if (user) {
          localStorage.setItem("email", JSON.stringify(user.email));
          localStorage.setItem(
            "fullname",
            JSON.stringify(user.name + " " + user.last_name)
          );
          if (user.cart) {
            localStorage.setItem("cartId", JSON.stringify(user.cart));
          }
        }
      })
      .catch((err) => console.log(err));
  };
  
  const getAllProducts = (limit, page, sort, query) => {
    let urlBase = `/products`;
    if (limit) {
      urlBase += `?limit=${limit}`;
    }
    if (page) {
      urlBase += `&page=${page}`;
    }
    if (sort) {
      urlBase += `&sort=${sort}`;
    }
    if (query) {
      urlBase += `&query[title]=${query}`;
    }
  
    fetch(`${urlBase}`)
      .then((res) => res.json())
      .then((data) => {
        const products = data.payload.docs;
        renderProducts(products);
        renderPagination(data.payload);
      })
      .catch((err) => console.log(err));
  };
  
  function renderProducts(products) {
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = "";
    products.forEach((product) => {
      productsContainer.innerHTML += `
        <div class="card" style="width: 220px; margin: 20px">
          <img class="card-img-top" src="${product.thumbnail}" alt="Product Image" />
          <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.price}</p>
          <button type="button" onclick="addToCart('${product._id}')" class="btn btn-primary">Add</button>
          <button type="button" onclick="deleteProduct('${product._id}')"class="btn btn-secondary">Remove</button>
          </div>
        </div>
      `;
    });
  }
  function renderPagination(payload) {
    let hasNextPage = payload.hasNextPage;
    let hasPrevPage = payload.hasPrevPage;
    let limit = payload.limit;
    let nextPage = payload.nextPage;
    let page = payload.page;
    let prevPage = payload.prevPage;
    let totalPages = payload.totalPages;
  
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = "";
    paginationContainer.innerHTML += `
      <nav aria-label="pagination">
      <ul class="pagination justify-content-end">
      <li class="page-item">
        <a class="page-link" ${
          hasPrevPage ? `onclick="getAllProducts(${limit}, ${prevPage})"` : ""
        }>Previous</a>
        </li>
        <li class="page-item active"><a class="page-link" href="#">${page}</a></li>
        <a class="page-link" ${
          hasNextPage ? `onclick="getAllProducts(${limit}, ${nextPage})"` : ""
        }>Next page</a>
        ${page} of ${totalPages}
        </ul>
        
      </nav>
    `;
  }
  
  const addToCart = (id) => {
    const cartId = JSON.parse(localStorage.getItem("cartId"));
    console.log(`Agregando producto id=${id} al carrito id=${cartId}`);
    fetch(`/carts/${cartId}/products/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((data) => {
        //reload page
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  
  const deleteProduct = (id) => {
    fetch(`/products/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        //reload page
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  
  const goToCart = () => {
    const cartId = JSON.parse(localStorage.getItem("cartId"));
    window.location.href = "/carts/" + cartId;
  };
  const goToLogin = () => {
    window.location.href = "/auth/login";
  };
  const goToRegister = () => {
    window.location.href = "/auth/register";
  };
  const goToLogout = () => {
    /**Puedo borrar todo el local storage o solo algunos items:
       *   localStorage.removeItem('nombreVariable1');
           localStorage.removeItem('nombreVariable2');
       */
  
    localStorage.clear();
    window.location.href = "/auth/logout";
  };
  
  const init = () => {
    getCurrentUser();
    getAllProducts(5, 1, null, null);
  };

  init();