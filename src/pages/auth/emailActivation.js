import React from "react";
import Auth from "../../hooks/auth";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

function EmailActivation() {
    const { access_token } = useParams()
    const { http, setToken } = Auth();

    const onSubmit = () => {
        http
            .post("/user/activate-email", {
                token: access_token
            })
            .then((res) => {
                toast.success(res?.data?.message)
                setTimeout(()=>{
                    setToken(res?.data?.data?.user, res?.data?.data?.access_token)
                },1000)
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message)
            });
    };

    return (
        <section className="relative flex h-screen w-screen flex-col bg-slate-100 justify-center items-center">
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <div className="w-full lg:w-3/5 mt-24 bg-white rounded-lg shadow-md py-10 max-w-xl">
                <div className="text-center p-4">
                    <p variant="h2" className="font-bold mb-4">Verification Email</p>
                    <button
                        onClick={onSubmit}
                        className="bg-blue-400 w-full py-2 rounded-md text-white"
                    >
                        Click To verif your email
                    </button>
                    {/* <p variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</p> */}
                </div>


            </div>
        </section>
    );
}


export default EmailActivation;
