import { Outlet } from "react-router-dom";
import Sidebar from "../components/Svgs/shared/Sidebar";
// import RightPanel from "../components/Svgs/shared/RightPanel";


function RootLayout() {


    //   const [isCollapsed, setisCollapsed] = useState(false)
    return (
        <div className="flex w-3/4  min-h-screen  ">
            {/* //sidebar + main home page flex  */}
            <div className="flex flex-1 ml-3 mt-2 ">
                {/* <aside className={`     h-screen`}> */}
                <Sidebar
                />

                <section className=" flex  ml-4 flex-1 p-4 h-full ">
                    <Outlet />

                </section>

                <div>
                    {/* <RightPanel /> */}
                    aaaaaaaaaaaaaaaaaaaaaaaaaaa
                </div>
            </div>

        </div>
    );
}

export default RootLayout;