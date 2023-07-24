import { MainLayout } from "@components/layout";
import { ItemList } from "@pages/items";
import { SaleOrderCreate, SaleOrderList } from "@pages/saleOrders";
import { authProvider } from "@providers/authProvider";
import { dataProvider } from "@providers/dataProvider";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          dataProvider={dataProvider("http://127.0.0.1:3333/api")}
          routerProvider={routerBindings}
          authProvider={authProvider}
          i18nProvider={i18nProvider}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          <Routes>
            <Route
              element={
                <MainLayout>
                  <Outlet />
                </MainLayout>
              }
            >
              <Route index element={<ItemList />} />
              <Route path="items" element={<ItemList />} />
              <Route path="sale-orders">
                <Route index element={<SaleOrderList />} />
                <Route path="create" element={<SaleOrderCreate />} />
              </Route>
            </Route>
          </Routes>
          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
