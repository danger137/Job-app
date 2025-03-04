"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import client from '@/lib/Contentfulclient';
interface User {
  name: string;
  role: string;
}

const fetchFetures = async ()=>{

let response = await client.getEntries({content_type:"features"});
const services = response.items.map((item)=>{
  return {
    title: item.fields.title,
    description: item.fields.description,
    emoji: item.fields.emoji,
  }
})

return services;


}
const fetchFetures2 = async ()=>{

let response = await client.getEntries({content_type:"aboutJobify"});
console.log(response.items);

const services = response.items.map((item)=>{
  return {
    description: item.fields.description,
    tags: item.fields.techTags,
  }
})

return services;


}

fetchFetures2();

type ServiceType = {
  title: string;
  description: string;
  emoji: string;
  tags?: string[]; 
};




const HomePage = () => {



  const [render, setRender] = useState<ServiceType[]>([]);
  const [render2, setRender2] = useState<ServiceType[]>([]);
  
  useEffect(() => {
    const fetchServices = async () => {
      let service = await fetchFetures();
      let service2 = await fetchFetures2();
  
    
      const formattedService: ServiceType[] = service.map((item: any) => ({
        title:
          typeof item.title === "string" ||
          typeof item.title === "number" ||
          typeof item.title === "boolean"
            ? String(item.title)
            : "Untitled", 
        description: typeof item.description === "string" ? item.description : "",
        emoji: typeof item.emoji === "string" ? item.emoji : "😊", // Default emoji
        tags: Array.isArray(item.tags) ? item.tags : [], // Ensure tags is an array
      }));
  

      const formattedService2: ServiceType[] = service2.map((item: any) => ({
        title: "No Title", 
        description: typeof item.description === "string" ? item.description : "",
        emoji: "📌",
        tags: Array.isArray(item.tags) ? item.tags : [], // Ensure tags is an array
      }));
  
      setRender(formattedService);
      setRender2(formattedService2);
    };
  
    fetchServices();
  }, []); 

   



  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    }
  }, []);



  const getDashboardLink = () => {
    if (user?.role === 'admin') {
      return '/AdminDashboard';
    }
    return '/DashboardUser';
  };

  return (

    <div>

<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {user ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
          <p className="mb-6">Access your account below:</p>
          <div className="flex justify-center space-x-4">
            <Link href="/jobs" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Jobs
            </Link>
            <Link href={getDashboardLink()} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Dashboard
            </Link>
        
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to the Jobstack</h1>
          <p className="mb-6">Please log in or sign up to continue.</p>
          <div className="flex space-x-4 justify-center">
            <Link href="/Login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Login
            </Link>
            <Link href="/Signup" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Signup
            </Link>
       
          </div>
        </div>
        
      )}
    </div>
    <section className="container mx-auto py-16 px-4">
  <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
    About Jobify
  </h2>
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    {render?.map((feature, index) => (
      <div key={ `feature-${index}`} className="text-center p-6 bg-white rounded-lg shadow-lg text-indigo-600">
        <div className="text-5xl mb-4">{feature.emoji}</div>
        <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    ))}
  </div>
</section>


   <section className="container mx-auto py-16 px-4">
  <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
    About Jobify
  </h2>

  {render2.map((render) => {
    return (
      <div key={render.title}> {/* Use render.id instead of index */}
        <p className="text-gray-600 text-lg leading-relaxed text-center max-w-3xl mx-auto">
          {render.description}
        </p>

        <div className="mt-12 flex flex-wrap justify-center">
          {render.tags?.map((tag: any) => (
            <span
              key={tag} // Assuming each tag is unique
              className="bg-gray-200 text-gray-800 m-2 px-5 py-2 rounded-full text-sm font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    );
  })}
</section>



    </div>

    
  );
};

export default HomePage;
