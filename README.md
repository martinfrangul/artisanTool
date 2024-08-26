## **ENGLISH**

# 🛒 Inventory and Sales Management System

## 📋Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
  - [Inventory Management](#inventory-management)
  - [Sales Management](#sales-management)
- [Context Providers](#context-providers)
  - [DataContext](#datacontext)
  - [AuthContext](#authcontext)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project is an Inventory and Sales Management System built with React and Firebase. It allows users to manage their inventory of products and record sales transactions. The system supports user authentication, product stock management, and sales history tracking.

<img src="https://github.com/user-attachments/assets/639a42d6-7aa8-45c5-9e15-f6f15ade8ea0" alt="loginImg" width="250"/>
<img src="https://github.com/user-attachments/assets/65407931-5f99-47e8-9ef4-90fb899b5c8d" alt="registerImg" width="250"/>


## ✨Features

- **User Authentication**: Secure authentication with Firebase.
- **Inventory Management**: Add, update, and delete products in your inventory.
- **Sales Management**: Record and track sales transactions.
- **Real-time Updates**: Inventory and sales data is updated in real-time.
- **Responsive Design**: Works on both desktop and mobile devices.

<img src="https://github.com/user-attachments/assets/bf2bf956-ad49-49ff-bf9e-d97f79ac6a8b" alt="homeImg" width="250"/>
<img src="https://github.com/user-attachments/assets/8cd1ac85-9b00-4d1c-986c-b89aa812add6" alt="crearInventarioImg" width="250"/>
<img src="https://github.com/user-attachments/assets/4b61297a-f832-4e02-9065-72fe54fcf1fc" alt="inventarioImg" width="250"/>
<img src="https://github.com/user-attachments/assets/7bedf4d0-8692-4022-ae7e-4817ff139fd8" alt="venderImg" width="250"/>
<img src="https://github.com/user-attachments/assets/bead068b-92f9-4a53-9391-b057d149a269" alt="registroDeVentasImg" width="250"/>
<img src="https://github.com/user-attachments/assets/406f249d-c523-4566-8388-d4bd128fefe7" alt="graficosYestadisticasImg" width="250"/>


## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Firebase**: A platform by Google for building web and mobile applications.
  - **Firestore**: A NoSQL database to store inventory and sales data.
  - **Authentication**: Handles user login and registration.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Vite**: A fast build tool for modern web projects.

## 🚀Installation

Follow these steps to set up the project locally:

```bash
git clone https://github.com/tuusuario/inventory-sales-management.git
cd inventory-sales-management
npm install
```

## Firebase Configuration

Create a Firebase project in the Firebase Console.
Create a .env file in the root directory of your project and add your Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Save the file and continue with the setup.


## Running the Project

Start the development server with:

```bash
npm run dev
The application should now be running on http://localhost:5173.
```

## 📂Project Structure
The project is organized as follows:

```bash
src/
│
├── assets/          # Images and icons
├── components/      # Reusable UI components
├── context/         # Context providers for state management
├── hooks/           # Custom React hooks
├── pages/           # Application pages
├── App.jsx          # Main application component
└── main.jsx         # Entry point of the application
```
 
## 💻Usage

### Inventory Management

- **Add Products**: Navigate to the Inventory section and fill out the form to add new products. You can specify properties such as name, stock, and price.<br /> 
- **Update Products**: Edit the details of existing products directly from the Inventory section.<br /> 
- **Delete Products**: Remove products from your inventory when they are no longer needed.

### Sales Management

- **Record Sales**: In the Sales section, select a product from your inventory, specify the quantity sold, and record the sale.<br /> 
- **View Sales History**: Track past sales with details such as date, product name, and sold quantity.

## Context Providers

### DataContext

Handles the state related to the inventory of products and sales.

**inventoryData**: Array of product objects in the inventory.<br /> 
**sellData**: Array of sales objects.<br /> 
**reloadData**: Function to reload data.
<br /> 
<br /> 

### AuthContext

Handles the user authentication, the login and logout states and the loading state.

## Authentication
This project uses Firebase Authentication to manage user login and registration. Users must be authenticated to access the inventory and sales management features.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request with any changes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
</br>

<hr>

## **ESPAÑOL**


# 🛒 Sistema de Gestión de Inventario y Ventas

## 📋Tabla de Contenidos

- [Introducción](#introducción)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Uso](#uso)
  - [Gestión de Inventario](#gestión-de-inventario)
  - [Gestión de Ventas](#gestión-de-ventas)
- [Proveedores de Contexto](#proveedores-de-contexto)
  - [DataContext](#datacontext)
  - [AuthContext](#authcontext)
- [Autenticación](#autenticación)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Introducción

Este proyecto es un Sistema de Gestión de Inventario y Ventas construido con React y Firebase. Permite a los usuarios gestionar su inventario de productos y registrar transacciones de ventas. El sistema soporta la autenticación de usuarios, la gestión de stock de productos y el seguimiento del historial de ventas.

<img src="https://github.com/user-attachments/assets/639a42d6-7aa8-45c5-9e15-f6f15ade8ea0" alt="loginImg" width="250"/>
<img src="https://github.com/user-attachments/assets/65407931-5f99-47e8-9ef4-90fb899b5c8d" alt="registerImg" width="250"/>

## ✨Características

- **Autenticación de Usuarios**: Autenticación segura con Firebase.
- **Gestión de Inventario**: Añadir, actualizar y eliminar productos en tu inventario.
- **Gestión de Ventas**: Registrar y realizar el seguimiento de transacciones de ventas.
- **Actualizaciones en Tiempo Real**: Los datos de inventario y ventas se actualizan en tiempo real.
- **Diseño Responsivo**: Funciona tanto en dispositivos de escritorio como en móviles.

<img src="https://github.com/user-attachments/assets/bf2bf956-ad49-49ff-bf9e-d97f79ac6a8b" alt="homeImg" width="250"/>
<img src="https://github.com/user-attachments/assets/8cd1ac85-9b00-4d1c-986c-b89aa812add6" alt="crearInventarioImg" width="250"/>
<img src="https://github.com/user-attachments/assets/4b61297a-f832-4e02-9065-72fe54fcf1fc" alt="inventarioImg" width="250"/>
<img src="https://github.com/user-attachments/assets/7bedf4d0-8692-4022-ae7e-4817ff139fd8" alt="venderImg" width="250"/>
<img src="https://github.com/user-attachments/assets/bead068b-92f9-4a53-9391-b057d149a269" alt="registroDeVentasImg" width="250"/>
<img src="https://github.com/user-attachments/assets/406f249d-c523-4566-8388-d4bd128fefe7" alt="graficosYestadisticasImg" width="250"/>

## Tecnologías Utilizadas

- **React**: Una biblioteca de JavaScript para construir interfaces de usuario.
- **Firebase**: Una plataforma de Google para construir aplicaciones web y móviles.
  - **Firestore**: Una base de datos NoSQL para almacenar datos de inventario y ventas.
  - **Authentication**: Maneja el inicio de sesión y registro de usuarios.
- **Tailwind CSS**: Un framework de CSS orientado a utilidades para el diseño.
- **Vite**: Una herramienta de construcción rápida para proyectos web modernos.

## 🚀Instalación

Sigue estos pasos para configurar el proyecto localmente:

```bash
git clone https://github.com/tuusuario/inventory-sales-management.git
cd inventory-sales-management
npm install
```
## Configuración de Firebase
Crea un proyecto de Firebase en la consola de Firebase.
Crea un archivo .env en el directorio raíz de tu proyecto y agrega tu configuración de Firebase:

```bash
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

Guarda el archivo y continúa con la configuración.

## Ejecución del Proyecto
Inicia el servidor de desarrollo con:

```bash
src/
│
├── assets/          # Imágenes e iconos
├── components/      # Componentes de UI reutilizables
├── context/         # Proveedores de contexto para la gestión del estado
├── hooks/           # Hooks personalizados de React
├── pages/           # Páginas de la aplicación
├── App.jsx          # Componente principal de la aplicación
└── main.jsx         # Punto de entrada de la aplicación
```

## 💻Uso

### Gestión de Inventario
- **Añadir Productos**: Navega a la sección de Inventario y completa el formulario para agregar nuevos productos. Puedes especificar propiedades como nombre, stock y precio. </br>
- **Actualizar Productos**: Edita los detalles de los productos existentes directamente desde la sección de Inventario.
- **Eliminar Productos**: Elimina productos de tu inventario cuando ya no sean necesarios.
### Gestión de Ventas
- **Registrar Ventas**: En la sección de Ventas, selecciona un producto de tu inventario, especifica la cantidad vendida y registra la venta.
- **Ver Historial de Ventas**: Realiza un seguimiento de las ventas pasadas con detalles como la fecha, el nombre del producto y la cantidad vendida.
## Proveedores de Contexto
### DataContext
Maneja el estado relacionado con el inventario de productos y las ventas.

**inventoryData**: Array de objetos de productos en el inventario.</br>
**sellData**: Array de objetos de ventas.</br>
**reloadData**: Función para recargar los datos.

### AuthContext

Maneja la autenticación de usuarios, los estados de inicio y cierre de sesión, y el estado de carga.

## Autenticación
Este proyecto utiliza Firebase Authentication para gestionar el inicio de sesión y el registro de usuarios. Los usuarios deben estar autenticados para acceder a las funciones de gestión de inventario y ventas.

## Contribuciones
¡Las contribuciones son bienvenidas! Por favor, abre un issue o envía un pull request con cualquier cambio.

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
