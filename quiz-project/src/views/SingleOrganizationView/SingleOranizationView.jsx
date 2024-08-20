import { useParams } from "react-router-dom"
import SingleOrganization from "../../components/organizationComponents/SingleOrganization/SingleOrganization";

const SingleOrganizationView =() =>{

    const organizationId= useParams();
    const idToPass= organizationId.organizationId;
    return(  
    <div className="container-fluid">
         < SingleOrganization  orgId={idToPass } />
    </div>
    )
}

export default SingleOrganizationView