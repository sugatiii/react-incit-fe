import React, { useState } from "react";
import Auth from "../../hooks/auth";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

function ResendEmail() {
    const { id } = useParams()
    const [disable, setDisable] = useState(false)
    const { http} = Auth();

    const onSubmit = () => {
        http
            .get("/user/resend-email/"+id)
            .then((res) => {
                toast.success(res?.data?.message)
                setDisable(true)
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
                    <p variant="h2" className="font-bold mb-4">Please check your Email Verification</p>
                    <button
                        onClick={onSubmit}
                        disabled={disable}
                        className={` ${disable ? 'bg-slate-500' : 'bg-blue-400'} w-full py-2 rounded-md text-white`}
                    >
                        Resend Email
                    </button>
                </div>


            </div>
        </section>
    );
}


export default ResendEmail;
