import React, { useState } from "react";
import { motion } from "framer-motion";
import { windowlistner } from "../WindowListener/WindowListener";
import "../Register/Register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
   /* const navigate = useNavigate(); */

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [role, setRole] = useState("");
    const [errors, setErrors] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeInOut" },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: "easeOut" },
        },
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:3000/user/signup",
                { name, email, password, confirm, role }
            );

            if (response.data.sucess === true) {
                navigate("/user/login");
            } else {
                setErrors(response.data.error[0].msg);
                setTimeout(() => {
                    setErrors("");
                }, 5000);
            }
        } catch (error) {
            console.log(error);
        }

        setName("");
        setEmail("");
        setPassword("");
        setConfirm("");
        setRole("");
    };

    windowlistner("pointermove", (e) => {
        setPosition({ x: e.clientX, y: e.clientY });
    });

    return (
        <motion.div
            style={styles.login}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div
                className="cursor"
                style={{
                    ...styles.cursor,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                }}
            ></div>

            <motion.div style={styles.innerLogin} variants={itemVariants}>
                <motion.div>
                    <h1 style={styles.artist}>LEARN ANYTIME, ANYWHERE</h1>
                    <p style={styles.stories}>
                        <span
                            style={{
                                fontWeight: "bold",
                                color: "rgb(222, 218, 219)",
                                fontFamily: "sans-serif",
                            }}
                        >
                            TRANSFORM THE WAY YOU LEARN.
                        </span>
                        ™ New here? Sign up today and get a free learning guide
                        and your first interactive lesson on us. Discover,
                        grow, and make learning an exciting journey with our
                        cutting-edge platform!
                    </p>
                </motion.div>

                <motion.div style={styles.centerss} variants={itemVariants}>
                    <motion.div>
                        <p style={styles.heading}>SIGN UP</p>
                        <p
                            style={{
                                ...styles.subheading,
                                marginBottom: errors ? "70px" : "30px",
                            }}
                        >
                            Join us today and unlock endless possibilities!
                        </p>
                        {errors && (
                            <p className="error" style={styles.error}>
                                {errors}
                            </p>
                        )}
                    </motion.div>

                    <motion.div>
                        <motion.div style={styles.emailContainer}>
                            <label htmlFor="name" style={styles.label}>
                                Name :
                            </label>
                            <input
                                style={styles.input}
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </motion.div>

                        <motion.div style={styles.emailContainer}>
                            <label htmlFor="email" style={styles.label}>
                                Email :
                            </label>
                            <input
                                style={styles.input}
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                                required
                            />
                        </motion.div>

                        <motion.div style={styles.emailContainer}>
                            <label htmlFor="password" style={styles.labelss}>
                                Password :
                            </label>
                            <input
                                style={styles.input}
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </motion.div>

                        <motion.div style={styles.emailContainer}>
                            <label htmlFor="confirm" style={styles.labels}>
                                Confirm Password :
                            </label>
                            <input
                                style={styles.input}
                                type="password"
                                id="confirm"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                        </motion.div>

                        <motion.div style={styles.emailContainer}>
                            <label htmlFor="role" style={styles.label}>
                                Role :
                            </label>
                            <input
                                style={styles.input}
                                type="text"
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                        </motion.div>

                        <motion.button
                            style={styles.button}
                            whileHover={{
                                scale: 1.06,
                                boxShadow:
                                    "0px 0px 12px rgba(255, 255, 255, 0.4)",
                                background:
                                    "linear-gradient(to right, rgba(255, 235, 59, 0.85), rgba(255, 204, 204, 0.85))",
                                color: "rgb(24, 18, 28)",
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                        >
                            SIGN UP
                        </motion.button>

                        <motion.div style={styles.accountText}>
                            Already have an account?{" "}
                            <motion.a
                                style={styles.links}
                                onClick={() => navigate("/user/login")}
                            >
                                Login!
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

const styles = {
    login: {
        backgroundColor: "rgb(31, 22, 35)",
        color: "#e0dfdd",
        minHeight: "100vh",
        textAlign: "center",
        display: "flex",
        fontFamily: "'Poppins', sans-serif",
        alignItems: "center",
        justifyContent: "center",
    },
    innerLogin: {
        width: "70%",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0px 0px 25px rgba(255, 255, 255, 0.05)",
    },
    heading: {
        color: "white",
        fontSize: "38px",
        fontWeight: "900",
        marginBottom: "5px",
        marginTop: "10%",
    },
    subheading: {
        fontSize: "18px",
        marginBottom: "5%",
    },
    label: {
        display: "block",
        marginRight: "520px",
        fontSize: "20px",
        marginBottom: "10px",
    },
    labelss: {
        display: "block",
        marginRight: "480px",
        fontSize: "20px",
        marginBottom: "10px",
    },
    labels: {
        display: "block",
        marginRight: "400px",
        fontSize: "20px",
        marginBottom: "10px",
    },
    /*input: {
        border: "none",
        width: "50%",
        padding: "15px",
        backgroundColor: "rgb(31, 22, 35)",
        color: "white",
        marginBottom: "30px",
        borderBottom: "2px solid rgb(173, 167, 167)",
        borderRadius: "6px",
        transition: "border-color 0.3s ease",
    },*/

     input: {
    border: 'none',
    width: '60%',
    padding: '14px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    borderBottom: "2px solid rgb(173, 167, 167)",
    borderRadius: '10px',
    marginBottom: '25px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease-in-out',
    fontFamily: "'Poppins', sans-serif",
    },
    


    button: {
        border: "2px solid rgb(173, 167, 167)",
        borderRadius: "30px",
        padding: "15px",
        width: "60%",
        marginTop: "20px",
        backgroundColor: "rgb(24, 18, 28)",
        fontSize: "18px",
        color: "white",
        fontWeight: "900",
        cursor: "pointer",
    },
    links: {
        borderBottom: "2px solid rgb(173, 167, 167)",
        cursor: "pointer",
    },
    cursor: {
        transition: "transform 0.18s ease",
        height: "60px",
        width: "60px",
        borderRadius: "50%",
        position: "fixed",
        border: "1px solid white",
        pointerEvents: "none",
        left: -30,
        top: -30,
        zIndex: 9999,
        opacity: "0.9",
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.6)",
    },
    error: {
        position: "absolute",
        top: "350px",
        left: "43%",
        backgroundColor: "rgba(255, 0, 0, 0.8)",
        color: "white",
        padding: "13px 35px",
        borderRadius: "7px",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
    },
    artist: {
        fontSize: "45px",
        fontWeight: "900",
        fontFamily: "'Michroma', sans-serif",
        background:
            "linear-gradient(to right, rgba(255, 235, 59, 0.85), rgba(255, 204, 204, 0.85))",
        color: "transparent",
        backgroundClip: "text",
        display: "inline-block",
    },
    stories: {
        fontSize: "18px",
        fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
        color: "#e0dfdd",
    },
    centerss: {
        textAlign: "center",
    },
    accountText: {
        marginTop: "20px",
        fontSize: "16px",
    },
};

export default Register;
