import React from 'react';
import { Link } from 'react-router-dom';
const SideBar: React.FunctionComponent = () => {
    return (
        <div className="fixed h-full px-2.5 pt-14 flex justify-center bg-green-700">
            <div className="flex flex-col">
                <Link to="/main_window" data-text="홈" className="text-white p-3 flex justify-center tooltip hover:bg-green-900">
                    <i className="fas fa-home"></i>
                </Link>
                <Link
                    to="/delivery"
                    data-text="배송건수 조회"
                    className="mt-3 text-white p-3 flex justify-center tooltip hover:bg-green-900"
                >
                    <i className="fas fa-truck"></i>
                </Link>
                <Link to="/keyword" data-text="키워드 검색" className="mt-3 text-white p-3 flex justify-center tooltip hover:bg-green-900">
                    <i className="fas fa-search"></i>
                </Link>
            </div>
        </div>
    );
};

export default SideBar;
