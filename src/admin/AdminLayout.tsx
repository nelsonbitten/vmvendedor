import React from 'react';
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Remarketing from './Remarketing';
import Posts from './Posts';
import ApiKeyConfig from './ApiKeyConfig';

const AdminLayout: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-800 text-white">
          <div className="p-4">
            <h2 className="text-2xl font-semibold">Admin Panel</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/admin/remarketing" className="block py-2 px-4 rounded hover:bg-gray-700">Remarketing</Link>
              </li>
              <li>
                <Link to="/admin/posts" className="block py-2 px-4 rounded hover:bg-gray-700">Posts</Link>
              </li>
              <li>
                <Link to="/admin/api-key" className="block py-2 px-4 rounded hover:bg-gray-700">Configurar API Key</Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-4">
          <Switch>
            <Route path="/admin/remarketing" component={Remarketing} />
            <Route path="/admin/posts" component={Posts} />
            <Route path="/admin/api-key" component={ApiKeyConfig} />
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default AdminLayout;
