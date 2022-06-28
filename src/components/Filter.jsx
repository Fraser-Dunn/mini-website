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
              {/* common races */}
              <div className="filter-race-div-common">
                {/* dragonborn */}
                <label htmlFor="dragonborn">
                  <input
                    type="checkbox"
                    id="dragonborn"
                    name="dragonborn"
                    onChange={(e) => handleChange(e, "race", "Dragonborn")}
                  />
                  Dragonborn
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

                {/* gnome */}
                <label htmlFor="gnome">
                  <input
                    type="checkbox"
                    id="gnome"
                    name="gnome"
                    onChange={(e) => handleChange(e, "race", "Gnome")}
                  />
                  Gnome
                </label>

                {/* half-elf */}
                <label htmlFor="half-elf">
                  <input
                    type="checkbox"
                    id="half-elf"
                    name="half-elf"
                    onChange={(e) => handleChange(e, "race", "Half-Elf")}
                  />
                  Half-Elf
                </label>

                {/* half-orc */}
                <label htmlFor="half-orc">
                  <input
                    type="checkbox"
                    id="half-orc"
                    name="half-orc"
                    onChange={(e) => handleChange(e, "race", "Half-Orc")}
                  />
                  Half-Orc
                </label>

                {/* halfling */}
                <label htmlFor="halfling">
                  <input
                    type="checkbox"
                    id="halfling"
                    name="halfling"
                    onChange={(e) => handleChange(e, "race", "Halfling")}
                  />
                  Halfling
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

                {/* tiefling */}
                <label htmlFor="tiefling">
                  <input
                    type="checkbox"
                    id="tiefling"
                    name="tiefling"
                    onChange={(e) => handleChange(e, "race", "Tiefling")}
                  />
                  Tiefling
                </label>
              </div>

              {/* monstrous races */}
              <div className="filter-race-div-monstrous">
                {/* bugbear */}
                <label htmlFor="bugbear">
                  <input
                    type="checkbox"
                    id="bugbear"
                    name="bugbear"
                    onChange={(e) => handleChange(e, "race", "Bugbear")}
                  />
                  Bugbear
                </label>

                {/* centaur */}
                <label htmlFor="centaur">
                  <input
                    type="checkbox"
                    id="centaur"
                    name="centaur"
                    onChange={(e) => handleChange(e, "race", "Centaur")}
                  />
                  Centaur
                </label>

                {/* goblin */}
                <label htmlFor="goblin">
                  <input
                    type="checkbox"
                    id="goblin"
                    name="goblin"
                    onChange={(e) => handleChange(e, "race", "Goblin")}
                  />
                  Goblin
                </label>

                {/* grung */}
                <label htmlFor="grung">
                  <input
                    type="checkbox"
                    id="grung"
                    name="grung"
                    onChange={(e) => handleChange(e, "race", "Grung")}
                  />
                  Grung
                </label>

                {/* hobgoblin */}
                <label htmlFor="hobgoblin">
                  <input
                    type="checkbox"
                    id="hobgoblin"
                    name="hobgoblin"
                    onChange={(e) => handleChange(e, "race", "Hobgoblin")}
                  />
                  Hobgoblin
                </label>

                {/* kobold */}
                <label htmlFor="kobold">
                  <input
                    type="checkbox"
                    id="kobold"
                    name="kobold"
                    onChange={(e) => handleChange(e, "race", "Kobold")}
                  />
                  Kobold
                </label>

                {/* lizardfolk */}
                <label htmlFor="lizardfolk">
                  <input
                    type="checkbox"
                    id="lizardfolk"
                    name="lizardfolk"
                    onChange={(e) => handleChange(e, "race", "Lizardfolk")}
                  />
                  Lizardfolk
                </label>

                {/* minotaur */}
                <label htmlFor="minotaur">
                  <input
                    type="checkbox"
                    id="minotaur"
                    name="minotaur"
                    onChange={(e) => handleChange(e, "race", "Minotaur")}
                  />
                  Minotaur
                </label>

                {/* orc */}
                <label htmlFor="orc">
                  <input
                    type="checkbox"
                    id="orc"
                    name="orc"
                    onChange={(e) => handleChange(e, "race", "Orc")}
                  />
                  Orc
                </label>
              </div>
              {/* exotic races */}
              <div className="filter-race-div-exotic">
                {/* aarakocra */}
                <label htmlFor="aarakocra">
                  <input
                    type="checkbox"
                    id="aarakocra"
                    name="aarakocra"
                    onChange={(e) => handleChange(e, "race", "Aarakocra")}
                  />
                  Aarakocra
                </label>

                {/* aasimar */}
                <label htmlFor="aasimar">
                  <input
                    type="checkbox"
                    id="aasimar"
                    name="aasimar"
                    onChange={(e) => handleChange(e, "race", "Aasimar")}
                  />
                  Aasimar
                </label>

                {/* fairy */}
                <label htmlFor="fairy">
                  <input
                    type="checkbox"
                    id="fairy"
                    name="fairy"
                    onChange={(e) => handleChange(e, "race", "Fairy")}
                  />
                  Fairy
                </label>

                {/* firbolg */}
                <label htmlFor="firbolg">
                  <input
                    type="checkbox"
                    id="firbolg"
                    name="firbolg"
                    onChange={(e) => handleChange(e, "race", "Firbolg")}
                  />
                  Firbolg
                </label>

                {/* genasi */}
                <label htmlFor="genasi">
                  <input
                    type="checkbox"
                    id="genasi"
                    name="genasi"
                    onChange={(e) => handleChange(e, "race", "Genasi")}
                  />
                  Genasi
                </label>

                {/* gith */}
                <label htmlFor="gith">
                  <input
                    type="checkbox"
                    id="gith"
                    name="gith"
                    onChange={(e) => handleChange(e, "race", "Gith")}
                  />
                  Gith
                </label>

                {/* goliath */}
                <label htmlFor="goliath">
                  <input
                    type="checkbox"
                    id="goliath"
                    name="goliath"
                    onChange={(e) => handleChange(e, "race", "Goliath")}
                  />
                  Goliath
                </label>

                {/* kenku */}
                <label htmlFor="kenku">
                  <input
                    type="checkbox"
                    id="kenku"
                    name="kenku"
                    onChange={(e) => handleChange(e, "race", "Kenku")}
                  />
                  Kenku
                </label>

                {/* triton */}
                <label htmlFor="triton">
                  <input
                    type="checkbox"
                    id="triton"
                    name="triton"
                    onChange={(e) => handleChange(e, "race", "Triton")}
                  />
                  Triton
                </label>
              </div>
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
