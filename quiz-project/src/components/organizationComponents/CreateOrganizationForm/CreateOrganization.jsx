import React, { useContext, useState } from "react"
import {AppContext} from "../../../appState/app.context";
import { toast } from "react-toastify";
import { createOrganizationInDB } from "../../../services/organization.service";

const CreateOrganization = () =>{
    const [org, setOrg]= useState({
        name:'',
        description:'',
        imgUrl:'',
    })
    const {userData}= useContext(AppContext);

    
    const updateOrg = (prop) => (e) => {
        setOrg((prevUser) => ({
          ...prevUser,
          [prop]: e.target.value,
        }));
      };
    
    const createOrg= async () =>{
        const {name, description, imgUrl } = org;

        if(!name){
            return toast.error('Please add a name for your Organization');
        }
        if(!description){
            return toast.error('Please add description for your Organization');
        }
        if(!imgUrl){
            return toast.error('Please add a image for your Organization');
        }

        org.owner = { [userData.uid]: userData.username };

        try {
            await createOrganizationInDB (org);
           
            return toast.success("Organization  Created ")
        }
        catch(error)
        {
            return toast.error(error);
        }
    }
     
    return (
        <div className="bd-example m-0 border-0">
            <input className="form-control"
             type="text"
             placeholder="Organization Name"
             value={org.name}
             onChange={updateOrg('name')}
            />

            <input className="form-control"
             type="text"
             placeholder="Organization Description"
             value={org.description}
             onChange={updateOrg('description')}
            />
              <input className="form-control"
             type="text"
             placeholder="Organization Image"
             value={org.imgUrl}
             onChange={updateOrg('imgUrl')}
            />

            <button onClick={createOrg} className="btn btn-primary">
                Create Organization
              </button>
        </div>
    )
}

export default CreateOrganization