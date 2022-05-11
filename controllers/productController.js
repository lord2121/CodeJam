const productModel = require('../models/productModel.js');
const FB = require("fb");

module.exports.getProducts = async (req, res) => {
    const foundItems = await productModel.find({}).sort({
        _id: -1
    });
    res.render('../views/product/products', {
        newProductItem: foundItems
    });
};

module.exports.productForm = (req, res) => {
    res.render("../views/product/productForm.ejs");
};

module.exports.productFormPost = async (req, res) => {
    const productTitle = req.body.newTitle
    const productImage = req.file.path;
    const productDescription = req.body.newDescription
    const {
        instagram,
        facebook
    } = req.body;


    const newProduct = new productModel({
        image: productImage,
        title: productTitle,
        description: productDescription
    })
    const id = newProduct._id
    await newProduct.save()

    let productUrl = process.env.HOST + "/product/" + id;
    if (facebook == "on") {
        FB.api(
            '/569175147961571/photos',
            'POST', {
            "message": productDescription + '\n' + productUrl,
            "url": productImage
        },
            async function (res) {
                if (!res || res.error) {
                    console.log(!res ? 'error occurred' : res.error);
                    return;
                } else {
                    const postId = res.id //Acesta este id-ul postarii de pe instagram
                    await productModel.findByIdAndUpdate(id, {
                        facebookId: postId
                    }, function (err, docs) {
                        if (err) {
                            console.log(err)
                        }
                    }).clone();
                }
            }
        );

    }

    if (instagram == "on") {
        FB.api(
            '/17841453033655742/media',
            'POST', {
            "image_url": productImage
        },
            function (res) {
                if (!res || res.error) {
                    console.log(!res ? 'error occurred' : res.error);
                    return;
                } else {
                    const containerId = res.id

                    FB.api(
                        '/17841453033655742/media_publish',
                        'POST', {
                        "creation_id": containerId
                    },
                        async function (response) {
                            if (!res || res.error) {
                                console.log(!res ? 'error occurred' : res.error);
                                return;
                            } else {
                                const mediaId = response.id //Acesta este id-ul postarii de pe instagram
                                await productModel.findByIdAndUpdate(id, {
                                    instagramId: mediaId
                                }, function (err, docs) {
                                    if (err) {
                                        console.log(err)
                                    }
                                }).clone();
                            }
                        }
                    );
                }
            }
        );
    }

    res.redirect("/product/all")
};

module.exports.getProduct = async (req, res) => {
    id = req.params.id;
    const product = await productModel.findById(id);
    const igID = product.instagramId;
    const fbID = product.facebookId;
    let comentarii = []
    if (fbID && igID) {
        const comentariiIgSiFb = []
        FB.api(
            '/' + fbID + '/comments',
            'GET', {},
            function (response) {
                if (!response || res.response) {
                    console.log(!response ? 'error occurred' : response.error);
                    return;
                } else {
                    Object.keys(response).forEach(key => {
                        Object.keys(response[key]).forEach(key1 => {
                            if (response[key][key1].message) comentariiIgSiFb.push(response[key][key1].message)

                        })
                    })
                    FB.api(
                        '/' + igID + '/comments',
                        'GET', {},
                        function (response) {
                            if (!response || res.response) {
                                console.log(!response ? 'error occurred' : response.error);
                                return;
                            } else {
                                Object.keys(response).forEach(function (key) {
                                    response[key].forEach(function (a) {
                                        comentariiIgSiFb.push(a.text)
                                    })
                                });

                                res.render('../views/product/product', {
                                    product,
                                    comments: comentariiIgSiFb
                                });
                            }
                        }
                    );


                }
            }
        );



    } else if (fbID) {
        const comentariiFacebook = []
        FB.api(
            '/' + fbID + '/comments',
            'GET', {},
            function (response) {
                if (!response || res.response) {
                    console.log(!response ? 'error occurred' : response.error);
                    return;
                } else {
                    Object.keys(response).forEach(key => {
                        Object.keys(response[key]).forEach(key1 => {
                            if (response[key][key1].message) comentariiFacebook.push(response[key][key1].message)

                        })
                    })
                }

                res.render('../views/product/product', {
                    product,
                    comments: comentariiFacebook
                });
            }
        );
    } else if (igID) {
        const comentariiInstagram = []
        FB.api(
            '/' + igID + '/comments',
            'GET', {},
            function (response) {
                if (!response || res.response) {
                    console.log(!response ? 'error occurred' : response.error);
                    return;
                } else {
                    Object.keys(response).forEach(function (key) {
                        response[key].forEach(function (a) {
                            comentariiInstagram.push(a.text)
                        })
                    });
                }

                res.render('../views/product/product', {
                    product,
                    comments: comentariiInstagram
                });
            }
        );

    } else res.render('../views/product/product', {
        product,
        comments: comentarii
    });
};

module.exports.deleteProduct = async (req, res) => {
    id = req.params.id;
    await productModel.deleteOne({
        _id: id
    });
    res.redirect("/product/all");
};