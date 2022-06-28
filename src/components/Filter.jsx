import React from "react";

const Filter = (props) => {
  const onAddFilter = (key, value) => {
    props.addFilter({
      key: key,
      value: value,
    });
  };

  const onRemoveFilter = (key, value) => {
    props.removeFilter({
      key: key,
      value: value,
    });
  };

  const handleChange = (e, key, value) => {
    if (e.target.checked) {
      onAddFilter(key, value);
    } else {
      onRemoveFilter(key, value);
    }
  };

  return (
    <>
      <div className="filter-container">
        <div className="filter-body shadow-md">
          <div className="filter-title-div">
            <h1>Filter</h1>
          </div>
          {/* filter div */}
          <div className="filter-div">
            {/* filter sets */}
            <div className="filter-sets-div">
              {/* boneyard */}
              <label htmlFor="Boneyard">
                <input
                  type="checkbox"
                  id="Boneyard"
                  name="Boneyard"
                  onChange={(e) => handleChange(e, "set", "Boneyard")}
                />
                Boneyard
              </label>
              {/* dungeon of the mad mage */}
              <label htmlFor="DotMM">
                <input
                  type="checkbox"
                  id="DotMM"
                  name="DotMM"
                  onChange={(e) =>
                    handleChange(e, "set", "Dungeon of the Mad Mage")
                  }
                />
                DotMM
              </label>
              {/* legends of barovia */}
              <label htmlFor="LoB">
                <input
                  type="checkbox"
                  id="LoB"
                  name="LoB"
                  onChange={(e) => handleChange(e, "set", "Legends of Barovia")}
                />
                LoB
              </label>
              {/* rage of demons */}
              <label htmlFor="RoD">
                <input
                  type="checkbox"
                  id="RoD"
                  name="RoD"
                  onChange={(e) => handleChange(e, "set", "Rage of Demons")}
                />
                RoD
              </label>
              {/* van richtens guide to ravenloft */}
              <label htmlFor="VRGtR">
                <input
                  type="checkbox"
                  id="VRGtR"
                  name="VRGtR"
                  onChange={(e) =>
                    handleChange(e, "set", "Van Richten's Guide to Ravenloft")
                  }
                />
                VRGtR
              </label>
            </div>

            {/* filter size */}
            <div className="filter-size-div">
              {/* tiny */}
              <label htmlFor="tiny">
                <input
                  type="checkbox"
                  id="tiny"
                  name="tiny"
                  onChange={(e) => handleChange(e, "size", "tiny")}
                />
                Tiny
              </label>
              {/* small */}
              <label htmlFor="small">
                <input
                  type="checkbox"
                  id="small"
                  name="small"
                  onChange={(e) => handleChange(e, "size", "Small")}
                />
                Small
              </label>
              {/* medium */}
              <label htmlFor="medium">
                <input
                  type="checkbox"
                  id="medium"
                  name="medium"
                  onChange={(e) => handleChange(e, "size", "Medium")}
                />
                Medium
              </label>
              {/* large */}
              <label htmlFor="large">
                <input
                  type="checkbox"
                  id="large"
                  name="large"
                  onChange={(e) => handleChange(e, "size", "Large")}
                />
                Large
              </label>
              {/* huge */}
              <label htmlFor="huge">
                <input
                  type="checkbox"
                  id="huge"
                  name="huge"
                  onChange={(e) => handleChange(e, "size", "Huge")}
                />
                Huge
              </label>
              {/* gargantuan */}
              <label htmlFor="gargantuan">
                <input
                  type="checkbox"
                  id="gargantuan"
                  name="gargantuan"
                  onChange={(e) => handleChange(e, "size", "Gargantuan")}
                />
                Gargantuan
              </label>
            </div>

            {/* filter race */}
            <div className="filter-race-div">
              {/* construct */}
              <label htmlFor="construct">
                <input
                  type="checkbox"
                  id="construct"
                  name="construct"
                  onChange={(e) => handleChange(e, "race", "Construct")}
                />
                Construct
              </label>

              {/* drow */}
              <label htmlFor="drow">
                <input
                  type="checkbox"
                  id="drow"
                  name="drow"
                  onChange={(e) => handleChange(e, "race", "Drow")}
                />
                Drow
              </label>

              {/* dwarf */}
              <label htmlFor="dwarf">
                <input
                  type="checkbox"
                  id="dwarf"
                  name="dwarf"
                  onChange={(e) => handleChange(e, "race", "Dwarf")}
                />
                Dwarf
              </label>

              {/* elf */}
              <label htmlFor="elf">
                <input
                  type="checkbox"
                  id="elf"
                  name="elf"
                  onChange={(e) => handleChange(e, "race", "Elf")}
                />
                Elf
              </label>

              {/* human */}
              <label htmlFor="human">
                <input
                  type="checkbox"
                  id="human"
                  name="human"
                  onChange={(e) => handleChange(e, "race", "Human")}
                />
                Human
              </label>
            </div>

            {/* filter type */}
            <div className="filter-type-div">
              {/* aberration */}
              <label htmlFor="aberration">
                <input
                  type="checkbox"
                  id="aberration"
                  name="aberration"
                  onChange={(e) => handleChange(e, "type", "Aberration")}
                />
                Aberration
              </label>

              {/* beast */}
              <label htmlFor="beast">
                <input
                  type="checkbox"
                  id="beast"
                  name="beast"
                  onChange={(e) => handleChange(e, "type", "Beast")}
                />
                Beast
              </label>

              {/* celestial */}
              <label htmlFor="celestial">
                <input
                  type="checkbox"
                  id="celestial"
                  name="celestial"
                  onChange={(e) => handleChange(e, "type", "Celestial")}
                />
                Celestial
              </label>

              {/* construct */}
              <label htmlFor="construct">
                <input
                  type="checkbox"
                  id="construct"
                  name="construct"
                  onChange={(e) => handleChange(e, "type", "Construct")}
                />
                Construct
              </label>

              {/* dragon */}
              <label htmlFor="dragon">
                <input
                  type="checkbox"
                  id="dragon"
                  name="dragon"
                  onChange={(e) => handleChange(e, "type", "Dragon")}
                />
                Dragon
              </label>

              {/* elemental */}
              <label htmlFor="elemental">
                <input
                  type="checkbox"
                  id="elemental"
                  name="elemental"
                  onChange={(e) => handleChange(e, "type", "Elemental")}
                />
                Elemental
              </label>

              {/* fey */}
              <label htmlFor="fey">
                <input
                  type="checkbox"
                  id="fey"
                  name="fey"
                  onChange={(e) => handleChange(e, "type", "Fey")}
                />
                Fey
              </label>

              {/* fiend */}
              <label htmlFor="fiend">
                <input
                  type="checkbox"
                  id="fiend"
                  name="fiend"
                  onChange={(e) => handleChange(e, "type", "Fiend")}
                />
                Fiend
              </label>

              {/* giant */}
              <label htmlFor="giant">
                <input
                  type="checkbox"
                  id="giant"
                  name="giant"
                  onChange={(e) => handleChange(e, "type", "Giant")}
                />
                Giant
              </label>

              {/* humanoid */}
              <label htmlFor="humanoid">
                <input
                  type="checkbox"
                  id="humanoid"
                  name="humanoid"
                  onChange={(e) => handleChange(e, "type", "Humanoid")}
                />
                Humanoid
              </label>

              {/* monstrosity */}
              <label htmlFor="monstrosity">
                <input
                  type="checkbox"
                  id="monstrosity"
                  name="monstrosity"
                  onChange={(e) => handleChange(e, "type", "Monstrosity")}
                />
                Monstrosity
              </label>

              {/* ooze */}
              <label htmlFor="ooze">
                <input
                  type="checkbox"
                  id="ooze"
                  name="ooze"
                  onChange={(e) => handleChange(e, "type", "Ooze")}
                />
                Ooze
              </label>

              {/* plant */}
              <label htmlFor="plant">
                <input
                  type="checkbox"
                  id="plant"
                  name="plant"
                  onChange={(e) => handleChange(e, "type", "Plant")}
                />
                Plant
              </label>

              {/* undead */}
              <label htmlFor="undead">
                <input
                  type="checkbox"
                  id="undead"
                  name="undead"
                  onChange={(e) => handleChange(e, "type", "Undead")}
                />
                Undead
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;
