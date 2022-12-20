require "set"

module Day18
  class << self
    def part_one(input)
      cubes = parse_cubes(input)
      find_surface_area(cubes)
    end

    def part_two(input)
      cubes = parse_cubes(input)
      find_outer_area(cubes)
    end

    $cache = {}

    def find_outer_area(cubes)
      cubeset = Set.new
      cubes.each { |cube| cubeset << cube }
      x_min = 99
      y_min = 99
      z_min = 99
      x_max = 0
      y_max = 0
      z_max = 0
      cubes.each do |cube|
        x_min = cube[0] < x_min ? cube[0] : x_min
        x_max = cube[0] > x_max ? cube[0] : x_max
        y_min = cube[1] < y_min ? cube[1] : y_min
        y_max = cube[1] > y_max ? cube[1] : y_max
        z_min = cube[2] < z_min ? cube[2] : z_min
        z_max = cube[2] > z_max ? cube[2] : z_max
      end

      x_min -= 1
      y_min -= 1
      z_min -= 1
      x_max += 1
      y_max += 1
      z_max += 1

      explore([[x_min, y_min, z_min]], cubeset, [[x_min, x_max], [y_min, y_max], [z_min, z_max]])
    end

    $cache = Set.new

    def explore(points, cubeset, ranges)
      total = 0
      while points.length > 0
        point = points.shift
        next if $cache.include?(point)
        $cache << point
        neighboring_points = [
          [point[0] + 1, point[1] + 0, point[2] + 0],
          [point[0] - 1, point[1] + 0, point[2] + 0],
          [point[0] + 0, point[1] + 1, point[2] + 0],
          [point[0] + 0, point[1] - 1, point[2] + 0],
          [point[0] + 0, point[1] + 0, point[2] + 1],
          [point[0] + 0, point[1] + 0, point[2] - 1],
        ]
        # See how many cubes this guy is touching
        neighboring_points.each { |point|
          if cubeset.include?(point)
            total += 1
          else
            if !$cache.include?(point)
              if !((point[0] < ranges[0][0]) || (point[0] > ranges[0][1]) ||
                   (point[1] < ranges[1][0]) || (point[1] > ranges[1][1]) ||
                   (point[2] < ranges[2][0]) || (point[2] > ranges[2][1]))
                points << point
              end
            end
          end
        }
      end
      total
    end

    def find_surface_area(cubes)
      total_area_of_individual_cubes = cubes.length * 6
      total_adjacent_faces = 0

      cube_queue = []

      loop do
        cube_to_process = nil
        if cube_queue.length > 0
          #   pop the next cube off the queue
          cube_to_process = cube_queue.shift
        elsif cubes.length > 0
          #or pop a cube off of cubes
          cube_to_process = cubes.shift
        else
          break
        end

        # find any adjacent cubes in the queue (2 numbers the same, one number one different)
        adjacent_count = 0 # used for early breaking
        cube_queue.each do |cube|
          if adjacent_count == 6
            # found all the cubes this one could possibly be touching
            break
          end
          if is_adjacent(cube_to_process, cube)
            total_adjacent_faces += 1
            adjacent_count += 1
          end
        end

        adjacent_indices = []
        cubes.delete_if do |cube|
          if adjacent_count == 6
            # found all the cubes this one could possibly be touching
            break
          end
          if is_adjacent(cube_to_process, cube)
            total_adjacent_faces += 1
            adjacent_count += 1
            cube_queue << cube
            true
          end
        end
      end
      return total_area_of_individual_cubes - (total_adjacent_faces * 2)
    end

    def is_adjacent(c1, c2)
      diffs = [
        (c1[0] - c2[0]).abs,
        (c1[1] - c2[1]).abs,
        (c1[2] - c2[2]).abs,
      ]
      diffs.max == 1 && diffs.count(0) == 2
    end

    def parse_cubes(input)
      result = []
      input.each do |line|
        result << line.scan(/\d+/).map!(&:to_i)
      end
      result
    end
  end
end

lines = File.readlines("examples/18/18.txt")
# puts Day18.part_one(lines)
# puts Day18.part_two(lines)
lines = File.readlines("inputs/18.txt")
# puts Day18.part_one(lines)
puts Day18.part_two(lines)
