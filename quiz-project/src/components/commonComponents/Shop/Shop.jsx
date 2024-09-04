import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Shop = () => {
  return (
    <div className="container mt-5 p-4 border rounded">
      <div className="row mb-4">
        <h3 className="text-center">Head Armor</h3>
        <div className="d-flex justify-content-center">
          {/* Head armor items */}
          <div className="row justify-content-center">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="col-2 text-center">
                <div className="border rounded mb-2 p-4"> {/* Armor Image Placeholder */}
                  <img
                    src="path_to_head_armor.png"
                    alt="Head Armor"
                    className="img-fluid"
                    style={{ height: '100px', width: '100px' }}
                  />
                </div>
                <button className="btn btn-primary btn-sm">Buy</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <h3 className="text-center">Torso Armor</h3>
        <div className="d-flex justify-content-center">
          {/* Torso armor items */}
          <div className="row justify-content-center">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="col-2 text-center">
                <div className="border rounded mb-2 p-4"> {/* Armor Image Placeholder */}
                  <img
                    src="path_to_torso_armor.png"
                    alt="Torso Armor"
                    className="img-fluid"
                    style={{ height: '100px', width: '100px' }}
                  />
                </div>
                <button className="btn btn-primary btn-sm">Buy</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <h3 className="text-center">Leg Armor</h3>
        <div className="d-flex justify-content-center">
          {/* Torso armor items */}
          <div className="row justify-content-center">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="col-2 text-center">
                <div className="border rounded mb-2 p-4"> {/* Armor Image Placeholder */}
                  <img
                    src="path_to_torso_armor.png"
                    alt="Torso Armor"
                    className="img-fluid"
                    style={{ height: '100px', width: '100px' }}
                  />
                </div>
                <button className="btn btn-primary btn-sm">Buy</button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Shop;