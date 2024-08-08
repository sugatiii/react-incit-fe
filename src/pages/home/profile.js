import { useForm } from "react-hook-form";
import Navbar from "../../components/navbar/navbar"
import { useNavigate } from "react-router-dom";
import Auth from "../../hooks/auth";
import toast, { Toaster } from "react-hot-toast";
import { FaPen } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const Profile = () => {
    const navigate = useNavigate();
    const { http, getUser, saveUser } = Auth();
    const user = getUser();
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState(user?.name)
    const [disable, setDisable] = useState(true)

    const nameRef = useRef(null)


    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true)
        await http
        .post("/user/reset-password/" + user?.id, {
            ...data,
            oldPassword: data?.oldPassword || ''
        })
        .then((res) => {
            saveUser(res?.data?.data, false)
            setLoading(false)
        })
        .catch((err) => {
            setLoading(false)
            toast.error(err?.response?.data?.message)
        });
    };

    const passwordValidator = (password) => {
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValidLength = password.length >= 8;

        return hasLowerCase && hasUpperCase && hasDigit && hasSpecialChar && isValidLength;
    };

    const confirmPassword = (confirmPassword) => {
        const password = watch("password");
        return password === confirmPassword;
    };



    const onUpdate = (data) => {
        http
            .post("/user/update/" + user?.id, {
                name: data
            })
            .then((res) => {
                saveUser(res?.data?.data, false)
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message)
            });
    }

    useEffect(() => {
        if (!disable) {
            nameRef?.current.focus();
        }
    }, [disable]);


    return (
        <>
            <div className="max-w-[1240px] mx-auto">
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                />

                <Navbar />
                <div className="mt-4 px-4 overflow-y-scroll h-screen flex flex-col gap-5">
                    <section className="flex flex-col gap-2">
                        <p className="text-[32px] font-bold">User</p>
                        <div className="bg-slate-100 rounded-sm w-full p-4">
                            <div>
                                <div className="mb-1 flex flex-col gap-6">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-3">
                                            <div variant="small" color="blue-gray" className="-mb-3 font-medium">
                                                Full Name
                                            </div>
                                            <input
                                                placeholder="Type Full Name"
                                                ref={nameRef}
                                                className="input"
                                                id="name"
                                                disabled={disable}
                                                value={name}
                                                onChange={(e) => {
                                                    setName(e.target.value)
                                                }}
                                                onBlur={(e) => {
                                                    setDisable(!disable)
                                                    onUpdate(e.target.value)
                                                }}
                                            />
                                        </div>
                                        <div className="group mt-7 flex items-center cursor-pointer ml-3 shadow-md w-10 h-10 rounded-md hover:shadow-xl justify-center"
                                            onClick={() => {
                                                setDisable(!disable)
                                            }}
                                        >
                                            <FaPen className="group-hover:text-opacity-50" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-3">
                                            <div variant="small" color="blue-gray" className="-mb-3 font-medium">
                                                Email
                                            </div>
                                            <input
                                                placeholder="name@mail.com"
                                                disabled={true}
                                                value={user?.email}
                                                className="input"
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>

                    <section className="flex flex-col gap-2">
                        <p className="text-[32px] font-bold">Security</p>
                        <div className="bg-slate-100 rounded-sm w-full p-4">
                            <form
                                className=""
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <div className="mb-1 flex flex-col gap-6 w-[50%]">
                                    {
                                        !user?.social && 
                                        (
                                            <div className="flex flex-col gap-4">
                                                <div variant="small" color="blue-gray" className="-mb-3 font-medium">
                                                    Old Password
                                                </div>
                                                <div>
                                                    <input
                                                        placeholder="Type Old Password"
                                                        type="Password"
                                                        className="input"
                                                        {...register("oldPassword", {
                                                            required: user?.social ? false : true,
                                                        })}
                                                    />
                                                    {errors?.oldPassword && <div className="text-red-500">{errors?.oldPassword?.type}</div>}

                                                </div>
                                            </div>
                                        )
                                    }
                                    <div variant="small" color="blue-gray" className="-mb-3 font-medium">
                                        Password
                                    </div>
                                    <div>
                                        <input
                                            placeholder="Type Password"
                                            type="password"
                                            className="input"
                                            {...register("password", {
                                                required: true,
                                                validate: passwordValidator,
                                            })}
                                        />
                                        {errors?.password && <div className="text-red-500">{errors?.password?.type === 'validate' ? 'Password min 8 char, include symbol, lower case and upper case' : errors?.password?.type}</div>}
                                    </div>
                                    <p variant="small" color="blue-gray" className="-mb-3 font-medium">
                                        Confirm Password
                                    </p>
                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Type Confirm Password"
                                            className="input"
                                            {...register("confirm", {
                                                required: true,
                                                validate: confirmPassword,
                                            })}
                                        />
                                        {errors?.confirm && <div className="text-red-500">{errors?.confirm?.type === 'validate' ? 'Password and confirm password are not the same' : errors?.confirm?.type}</div>}
                                    </div>
                                </div>
                                <div className="w-full flex justify-end">
                                    <button disabled={loading} className="mt-6 bg-blue-400 px-4 py-2 text-white rounded-md shadow-md max-w-10" type="submit">
                                       {loading ? 'Loading...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </section>

                    {/* <Table columns={columns} data={data}></Table> */}
                </div>
            </div>
        </>
    )
}

export default Profile