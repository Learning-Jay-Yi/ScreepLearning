module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.worker =
        function (energy,roleName,numberOfWorkParts,home,target) {
            // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
            var body = [];
            for (let i = 0; i < numberOfWorkParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfWorkParts; i++) {
                body.push(CARRY);
            }

            // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
            energy -= 150 * numberOfWorkParts;

            var numberOfMoves = Math.floor(energy / 50);

            for (let i = 0; i < numberOfMoves; i++) {
                body.push(MOVE);
            }

            // create creep with the created body
            return this.createCreep(body, undefined, {
                role: roleName,
                home: home,
                target: target,
                working: false
            });
        };
};
