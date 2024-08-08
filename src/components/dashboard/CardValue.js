const CardValue = ({icon, title, value}) =>{
    return(
        <div className="flex gap-3 border border-slate-300 w-full md:max-w-[220px] flex-1 p-2 rounded-sm">
            <div className="flex items-center">
                {icon}
            </div>
            <div className="flex flex-col flex-1 justify-center items-center">
                <p className="text-lg font-semibold text-center">{title}</p>
                <p className="text-2xl text-center">{value}</p>
            </div>

        </div>
    )
}

export default CardValue