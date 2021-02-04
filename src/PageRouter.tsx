import React from 'react';

import { Layout } from './layouts';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Home, Delivery, Keyword } from './pages';

const PageRouter = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Switch>
                    <Route exact path="/main_window" component={Home} />
                    <Route path="/delivery" component={Delivery} />
                    <Route path="/keyword" component={Keyword} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
};

export default PageRouter;
