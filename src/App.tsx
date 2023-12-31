import { MainLayout } from "@components/layout";
import { InvetoryLevelList } from "@pages/inventoryLevels";
import { InvetoryTransactionList } from "@pages/inventoryTransactions";
import { ItemList } from "@pages/items";
import {
  ProductionOrderList,
  ProductionOrderShow,
} from "@pages/productionOrders";
import {
  SaleOrderCreate,
  SaleOrderList,
  SaleOrderShow,
  SaleOrderEdit,
} from "@pages/saleOrders";
import { authProvider } from "@providers/authProvider";
import { dataProvider } from "@providers/dataProvider";
import { notificationProvider } from "@providers/notificationProvider";
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
          notificationProvider={notificationProvider}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
          resources={[
            {
              name: "production-orders",
              list: "/production-orders",
              show: "/production-orders/show/:id",
            },
            {
              name: "items",
              list: "/items",
            },
            {
              name: "inventory-levels",
              list: "/inventory-levels",
            },
            {
              name: "inventory-transactions",
              list: "/inventory-transactions",
            },
            {
              name: "sale-orders",
              list: "/sale-orders",
              create: "/sale-orders/create",
              show: "/sale-orders/show/:id",
              edit: "/sale-orders/edit/:id",
            },
          ]}
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
              <Route path="inventory-levels" element={<InvetoryLevelList />} />
              <Route
                path="inventory-transactions"
                element={<InvetoryTransactionList />}
              />

              <Route path="sale-orders">
                <Route index element={<SaleOrderList />} />
                <Route path="create" element={<SaleOrderCreate />} />
                <Route path="show/:id" element={<SaleOrderShow />} />
                <Route path="edit/:id" element={<SaleOrderEdit />} />
              </Route>
              <Route path="production-orders">
                <Route index element={<ProductionOrderList />} />
                <Route path="show/:id" element={<ProductionOrderShow />} />
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
