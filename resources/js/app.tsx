import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NewAgentDialog from './Components/Dialogs/NewAgentDialog';
import ActivityEditDialog from './Components/TabContainer/TabActivityLogsComponents/ActivityEditDialog';
import ActivityAddDialog from './Components/TabContainer/TabActivityLogsComponents/ActivityAddDialog';
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <NewAgentDialog />
                <ActivityEditDialog />
                <ActivityAddDialog />
                <ToastContainer transition={Flip} autoClose={10000} pauseOnHover={false} theme='dark'/>
                <App {...props} />
            </>
            
        );
    },
    progress: {
        delay:50,
        color: '#0284c7',
    },
});
