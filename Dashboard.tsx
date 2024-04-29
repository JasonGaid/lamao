// Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  useIonToast,
} from '@ionic/react';

const Dashboard: React.FC = () => {
  const [present] = useIonToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryData, setSelectedCategoryData] = useState<any>(null);
  const [user, setUser] = useState<any>(null); // State to store user information
  const history = useHistory();

  useEffect(() => {
    // Retrieve user information from local storage
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
    } else {
      // Redirect to login if user information is not found
      history.push('/login');
    }

    // Fetch categories when component mounts
    fetchCategories();
  }, [history]);

  async function fetchCategories() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      present({
        message: "Failed to fetch categories",
        duration: 3000,
        position: "top",
      });
    }
  }

  async function fetchCategoryData(selectedCategory: string) {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/categories?name=${selectedCategory}`);
      setSelectedCategoryData(response.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
      present({
        message: "Failed to fetch category data",
        duration: 3000,
        position: "top",
      });
    }
  }

  async function createBlog() {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/create-post", {
        title,
        content,
        category,
        image,
      });

      if (response.status === 200) {
        present({
          message: "Blog Created Successfully",
          duration: 3000,
          position: "top",
        });
        history.push("/details");
      } else {
        present({
          message: "Failed to create blog",
          duration: 3000,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      present({
        message: "Failed to create blog",
        duration: 3000,
        position: "top",
      });
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Welcome to Dashboard</IonTitle>
          {user && <IonTitle slot="end">Welcome, {user.name}</IonTitle>}
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonList>
          <IonItem>
            <IonInput
              name="title"
              type="text"
              label="Title"
              labelPlacement='floating'
              placeholder='Enter Title'
              value={title}
              onIonChange={(e: any) => setTitle(e.target.value)}
            />
          </IonItem>
          <IonItem>
            <IonInput
              name="content"
              type="text"
              label="Content"
              labelPlacement='floating'
              placeholder='Enter Content'
              value={content}
              onIonChange={(e: any) => setContent(e.target.value)}
            />
          </IonItem>
          <IonItem>
            <IonSelect
              name="category"
              placeholder="Select Category"
              value={category}
              onIonChange={(e: any) => {
                setCategory(e.detail.value);
                fetchCategoryData(e.detail.value);
              }}
            >
              {/* Map over categories and create options */}
              {categories.map((cat, index) => (
                <IonSelectOption key={index} value={cat.name}>{cat.name}</IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonInput
              name="image"
              type="text"
              label="Image"
              labelPlacement='floating'
              placeholder='Enter Image URL'
              value={image}
              onIonChange={(e: any) => setImage(e.target.value)}
            />
          </IonItem>
        </IonList>
        <IonButton onClick={createBlog} expand='full'>
          Create Blog
        </IonButton>
        {/* Display category data */}
        {selectedCategoryData && (
          <div>
      
            <p>{selectedCategoryData.name}</p> {/* Assuming 'name' is a property of your category data */}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default Dashboard;
