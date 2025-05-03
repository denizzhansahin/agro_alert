// ClientComponent.tsx
"use client";

import React, { useEffect } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache, split } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { setContext } from '@apollo/client/link/context';
import { Operation } from '@apollo/client';

import { Provider, useDispatch } from "react-redux";
import { store } from './store'
import { setKullanici } from "./redux/kullaniciGirisSlice";

// GraphQL sunucunuzun URL'si
const httpLink = new HttpLink({
  uri: 'http://192.168.0.166:5000/graphql'
});

// Token'ı header'a ekleyen middleware (sadece token varsa)
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }), // Token varsa ekle
    }
  };
});

// Public operasyonları belirle (örneğin: kullaniciOlustur)
const isPublicOperation = (operation: Operation) => {
  console.log('Operation Name:', operation.operationName)
  const publicOperations = ['kullaniciOlustur', 'login']; // Public operasyon adlarını ekleyin
  return publicOperations.includes(operation.operationName);
};

// Split link: Public operasyonlarda authLink'i atla
const splitLink = split(
  isPublicOperation,
  httpLink, // Public isteklerde direkt httpLink kullan
  authLink.concat(httpLink) // Diğerlerinde authLink ekle
);

// Apollo Client yapılandırması
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});


function ReduxInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini al ve Redux'a yükle
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setKullanici(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function ClientComponent({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ReduxInitializer>
          {children}
        </ReduxInitializer>
      </ApolloProvider>
    </Provider>
  );
}