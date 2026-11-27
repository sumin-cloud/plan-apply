import { Outlet } from "react-router-dom";

export default function Layout(){
    return( 
        
        <div>
            <header className="header">
                
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
        
    )
}