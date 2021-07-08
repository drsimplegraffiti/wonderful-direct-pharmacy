/ Register
router.post('/register', async(req, res) => {
    const { email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                message: "User already exist, please signIn.",
            });


        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        //email validation
        const emailVerificationToken = jwt.sign({ email, password }, JWT_SECRET, { expiresIn: '20min' });
        //activation email begin
        const data = {
            from: 'noreply@preciouspharmacy.com',
            to: email,
            subject: 'Account Activation Link',
            html: `
                <h2>please click on link to activate your account</h2>
                <p><a>${process.env.CLIENT_URL}/authentication/activate${emailVerificationToken}</a></p>
            `
        };
        mg.messages().send(data, function(error, body) {
            if (error) {
                return res.json({
                    error
                })
            }
            return res.json({ message: 'Email has been sent kindly activate your account' })
            console.log(body);
        });

        exports.activateAccount = (req, res) => {
            const { token } = req.body;
            if (token) {
                jwt.verify(token, process.env.JWT_SECRET, function(err, decodedToken) {
                    if (err) {
                        return res.status(400).json({ error: "Incorrect or expired link" })
                    }
                    const { email, password } = decodedToken;
                    User.findOne({ email }.exec((err, user) => {
                        if (user) {
                            return res.status(400).json({ error: "User with this email already exists" })
                        }
                        let newUser = new User({ email, password });

                        newUser.save((err, success) => {
                            if (err) {
                                console.log("Error in Registration during account activation: ", err);
                                return res.status(400).json({ error: "Error activating account" })
                            }
                            res.json({
                                message: "Registration successful"
                            })
                        })
                    }))
                })
            } else {
                return res.json({ error: "Something went wrong" })
            }
        }

        //activation email end
        // res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

})