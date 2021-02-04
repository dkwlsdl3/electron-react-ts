import React from 'react';
import { TitleBar, SideBar } from '.';
import { withRouter } from 'react-router-dom';

const Layout = withRouter(({ children, match, location }) => {
    return (
        <>
            <SideBar />
            <TitleBar />
            <div className="h-full pt-10 pl-16 min-w-full">
                <div className="h-full overflow-y-auto">
                    <div className="mt-5 mx-auto w-11/12">{children}</div>
                </div>
            </div>
        </>
    );
});

export default Layout;
