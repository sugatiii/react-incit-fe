import React from "react";
import Auth from "../../hooks/auth";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FaFacebookSquare } from "react-icons/fa";

const isValidEmail = (email) =>
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

function Login() {
  // const navigate = useNavigate();
  const { http, setToken } = Auth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    http
      .post("/user/login", data)
      .then((res) => {
        // console.log(res)
        // let access_token = http.post("/user/refresh-token").then((val)=>{
        //   console.log(val)
        // })
        setToken(res?.data?.data?.user, res?.data?.data?.access_token)
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message)
        // console.log(err);
      });
  };

  const handleEmailValidation = (email) => {
    const isValid = isValidEmail(email);

    const validityChanged =
      (errors.email && isValid) || (!errors.email && !isValid);
    if (validityChanged) {
      console.log("Fire tracker with", isValid ? "Valid" : "Invalid");
    }

    return isValid;
  };

  const responseMessage = (response) => {
    http
      .post("/user/google-login", {
        clientId: response?.clientId,
        credential: response?.credential,
      })
      .then((res) => {
        setToken(res?.data?.data?.user, res?.data?.data?.access_token)
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message)
      });
  };


  const facebookLogin = async(response) => {
      console.log(response)

    await http
      .post("/user/facebook-login", {
        name: response?.data?.name,
        email: response?.data?.email,
      })
      .then((res) => {
        setToken(res?.data?.data?.user, res?.data?.data?.access_token)
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message)
      });
  };


  const errorMessage = (error) => {
    console.log(error, 'err');
  };

  return (
    <section className="relative flex h-screen w-screen flex-col bg-slate-100 justify-center items-center">
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <div className="w-full lg:w-3/5 mt-24 bg-white rounded-lg shadow-md py-10 max-w-xl">
        <div className="text-center">
          <p variant="h2" className="font-bold mb-4">Sign In</p>
          <p variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</p>
        </div>
        <form
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-1 flex flex-col gap-6">
            <div variant="small" color="blue-gray" className="-mb-3 font-medium">
              Email
            </div>
            <input
              placeholder="name@mail.com"
              className="input"
              type="email"
              id="email"
              {...register("email", {
                required: true,
                validate: handleEmailValidation,
              })}
            />
            {errors.email && <p className="text-red-300">This field is required and must be email</p>}
            <p variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </p>
            <input
              type="password"
              placeholder="********"
              className="input"
              {...register("password", { required: true })}
            />
            {errors.password && <p className="text-red-300">This field is required</p>}
          </div>
          <div className="w-full flex justify-center">
            <button className="mt-6 bg-blue-400 px-4 py-2 rounded-md w-full shadow-md" type="submit">
              Sign In
            </button>
          </div>
          <div className="mt-8 flex flex-col justify-center items-center gap-2">
            <GoogleLogin text="signin_with" onSuccess={responseMessage} onError={errorMessage} size="large" />
            <LoginSocialFacebook
              appId={process.env.REACT_APP_APP_FACEBOOK_ID}
              onResolve={(response) => {
                facebookLogin(response)
              }}
              onReject={(error) => {
                toast.error(error.message)
              }}
            >
              <div className="flex items-center gap-2.5 cursor-pointer border border-slate-300 px-4 py-1.5 min-w-[235px] bg-slate-50 bg-opacity-50 rounded-sm">
                <FaFacebookSquare className="text-blue-700 h-5 w-5"/>
                <div>Login with Facebook</div>
              </div>
            </LoginSocialFacebook>
          </div>
          <div variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">sign up</Link>
          </div>
        </form>

      </div>
    </section>
  );
}


export default Login;
