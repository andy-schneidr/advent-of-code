module Day22
  class << self
    def part_one(input)
      instructions = parse_instructions(input)
      map = input[0..input.length - 3]
      puts map
      puts instructions
      puts ""
      traverse(map, instructions)
    end

    def part_two(input)
      instructions = parse_instructions(input)
      map = input[0..input.length - 3]
      puts map
      puts instructions
      puts ""
      traverse(map, instructions, true)
    end

    $up = [-1, 0]
    $dn = [1, 0]
    $lf = [0, -1]
    $rt = [0, 1]

    # Y IS THE FIRST AXIS, X IS THE SECOND AXIS
    def traverse(map, instructions, b = false)
      x = get_start(map)
      y = 0

      puts "start: [#{y}, #{x}]"

      dir = $rt

      instructions.each do |instruction|
        if b
          debug "Running instruction: #{instruction}"
          x, y, dir = execute_instruction_b(map, instruction, x, y, dir)
        else
          x, y, dir = execute_instruction(map, instruction, x, y, dir)
        end
      end
      return ((1000 * (y + 1)) + (4 * (x + 1)) + get_dir_value(dir))
    end

    $debug = true

    def debug(string)
      if $debug
        puts string
      end
    end

    $size = 50

    #     y,  x    y,  x
    # $a = [[0, 50], [49, 99]]
    # $b = [[0, 100], [49, 149]]
    # $c = [[50, 50], [99, 99]]
    # $d = [[100, 0], [149, 49]]
    # $e = [[100, 50], [149, 99]]
    # $f = [[150, 0], [199, 49]]
    $a = [[0, 1 * $size], [(1 * $size) - 1, (2 * $size) - 1]]
    $b = [[0, 2 * $size], [(1 * $size) - 1, (3 * $size) - 1]]
    $c = [[1 * $size, 1 * $size], [(2 * $size) - 1, (2 * $size) - 1]]
    $d = [[2 * $size, 0], [(3 * $size) - 1, (1 * $size) - 1]]
    $e = [[2 * $size, 1 * $size], [(3 * $size) - 1, (2 * $size) - 1]]
    $f = [[3 * $size, 0], [(4 * $size) - 1, (1 * $size) - 1]]
    $cubes = [$a, $b, $c, $d, $e, $f]

    def get_cube(x, y)
      $cubes.each do |cube|
        puts cube.to_s
        if x >= cube[0][1] && x <= cube[1][1] &&
           y >= cube[0][0] && y <= cube[1][0]
          return cube
        end
      end
      puts "you really goofed it"
    end

    def in_cube(x, y, cube)
      return (x >= cube[0][1] && x <= cube[1][1] &&
              y >= cube[0][0] && y <= cube[1][0])
    end

    def execute_instruction_b(map, instruction, x, y, dir)
      debug "Instruction: #{instruction}"
      if instruction.to_i == 0
        # this is a rotation
        dir = rotate(dir, instruction)
        debug "direction change, new dir: #{dir}"
        return x, y, dir
      end

      # this is a movement
      1.step(instruction.to_i, 1) { |step|
        start_cube = get_cube(x, y)
        next_y = y + dir[0]
        next_x = x + dir[1]
        next_cube = get_cube(next_x, next_y)

        if !(start_cube == next_cube)
          puts "Walking off the cube! #{start_cube.to_s} next_y: #{next_y}, next_x: #{next_x}"
        end

        next_dir = dir
        if start_cube != next_cube
          next_x, next_y, next_dir = traverse_cubes(x, y, dir)
        end

        # Check if we will run into something, stop if so
        if map[next_y][next_x] == "#"
          break
        elsif map[next_y][next_x] == "."
          # actually move
          x = next_x
          y = next_y
          dir = next_dir
        else
          puts "pretty sure u screwed up: next_y: #{next_y}, next_x: #{next_x} dir: #{dir.to_s}"
        end

        debug "new position: [#{y}, #{x}, #{dir.to_s}]"
      }
      return x, y, dir
    end

    def traverse_cubes(x, y, dir)
      start_cube = get_cube(x, y)

      if start_cube == $a
        if dir == $dn
          return x + dir[1], y + dir[0], dir # no change
        elsif dir == $up
          return 0, (2 * $size) + x, $rt
        elsif dir == $lf
          return 0, ((3 * $size) - 1) - y, $rt
        elsif dir == $rt
          return x + dir[1], y + dir[0], dir # no change
        end
      elsif start_cube == $b
        if dir == $dn
          return (2 * $size) - 1, (x - $size), $lf
        elsif dir == $up
          return x - (2 * $size), (4 * $size) - 1, $up
        elsif dir == $lf
          return x + dir[1], y + dir[0], dir # no change
        elsif dir == $rt
          return (2*$size)-1, ((3 * $size) - 1) - y, $lf # E
        end
      elsif start_cube == $c
        if dir == $dn
          return x + dir[1], y + dir[0], dir # no change
        elsif dir == $up
          return x + dir[1], y + dir[0], dir # no change
        elsif dir == $lf
          return y - $size, (2 * $size), $dn # D
        elsif dir == $rt
          return y + $size, ($size - 1), $up # B
        end
      elsif start_cube == $d
        if dir == $dn
          return x + dir[1], y + dir[0], dir # no change
        elsif dir == $up
          return $size, (x + $size), $rt # C
        elsif dir == $lf
          return $size, ((3 * $size) - 1) - y, $rt # A
        elsif dir == $rt
          return x + dir[1], y + dir[0], dir # no change
        end
      elsif start_cube == $e
        if dir == $dn
          return ($size - 1), (2 * $size) + x, $lf # F
        elsif dir == $up
          return x + dir[1], y + dir[0], dir # no change
        elsif dir == $lf
          return x + dir[1], y + dir[0], dir # no change
        elsif dir == $rt
          return (3 * $size) - 1, (3 * $size - 1) - y, $lf # B
        end
      elsif start_cube == $f
        if dir == $dn
          return x + (2 * $size), 0, $dn # B
        elsif dir == $up
          return x + dir[1], y + dir[0], dir # no change
        elsif dir == $lf
          return y - (2 * $size), 0, $dn # A
        elsif dir == $rt
          return y - (2 * $size), (3 * $size) - 1, $up # E
        end
      end

      puts "We probably shouldn't get to here"
      # Check if we're running off the edge of the map
      if next_y < 0
        debug "a"
        # must wrap back to end
        next_y = map.length - 1
      end

      if next_y >= map.length
        debug "b"
        # must wrap back to beginning
        next_y = 0
      end

      if next_x < 0
        debug "c"
        # must wrap back to end
        next_x = map[y].length - 2
      end

      if next_x >= map[y].length - 1
        debug "d"
        # must wrap back to beginning
        next_x = 0
      end

      while map[next_y][x] == " "
        debug "e #{next_y} #{x}"
        # keep going in this direction until we wrap around
        next_y += dir[0]
        if next_y < 0
          # must wrap back to end
          next_y = map.length - 1
        end

        if next_y >= map.length
          # must wrap back to beginning
          next_y = 0
        end
      end

      while map[y][next_x] == " "
        debug "f #{y} #{next_x}"
        # keep going in this direction until we wrap around
        next_x += dir[1]
        if next_x < 0
          # must wrap back to end
          next_x = map[y].length - 2
        end

        if next_x >= map[y].length - 1
          # must wrap back to beginning
          next_x = 0
        end
      end
    end

    def execute_instruction(map, instruction, x, y, dir)
      debug "Instruction: #{instruction}"
      if instruction.to_i == 0
        # this is a rotation
        dir = rotate(dir, instruction)
        debug "direction change, new dir: #{dir}"
        return x, y, dir
      end

      # this is a movement
      1.step(instruction.to_i, 1) { |step|
        next_y = y + dir[0]
        next_x = x + dir[1]

        # Check if we're running off the edge of the map
        if next_y < 0
          debug "a"
          # must wrap back to end
          next_y = map.length - 1
        end

        if next_y >= map.length
          debug "b"
          # must wrap back to beginning
          next_y = 0
        end

        if next_x < 0
          debug "c"
          # must wrap back to end
          next_x = map[y].length - 2
        end

        if next_x >= map[y].length - 1
          debug "d"
          # must wrap back to beginning
          next_x = 0
        end

        while map[next_y][x] == " "
          debug "e #{next_y} #{x}"
          # keep going in this direction until we wrap around
          next_y += dir[0]
          if next_y < 0
            # must wrap back to end
            next_y = map.length - 1
          end

          if next_y >= map.length
            # must wrap back to beginning
            next_y = 0
          end
        end

        while map[y][next_x] == " "
          debug "f #{y} #{next_x}"
          # keep going in this direction until we wrap around
          next_x += dir[1]
          if next_x < 0
            # must wrap back to end
            next_x = map[y].length - 2
          end

          if next_x >= map[y].length - 1
            # must wrap back to beginning
            next_x = 0
          end
        end

        # Check if we will run into something, stop if so
        if map[next_y][next_x] == "#"
          break
        elsif map[next_y][next_x] == "."
          # actually move
          x = next_x
          y = next_y
        else
          puts "pretty sure u screwed up"
        end

        debug "new position: [#{y}, #{x}]"
      }

      return x, y, dir
    end

    def rotate(dir, instruction)
      if instruction == "R"
        if dir == $up
          dir = $rt
        elsif dir == $rt
          dir = $dn
        elsif dir == $dn
          dir = $lf
        elsif dir == $lf
          dir = $up
        end
      elsif instruction == "L"
        if dir == $up
          dir = $lf
        elsif dir == $lf
          dir = $dn
        elsif dir == $dn
          dir = $rt
        elsif dir == $rt
          dir = $up
        end
      end

      return dir
    end

    def get_dir_value(dir)
      if dir == $rt
        return 0
      elsif dir == $dn
        return 1
      elsif dir == $lf
        return 2
      elsif dir == $up
        return 3
      end
      puts "you did something dumb"
    end

    def get_start(map)
      0.step(map[0].length - 1, 1) { |i|
        if map[0][i] == "."
          return i
        end
      }
    end

    def parse_instructions(input)
      input.last.scan(/\d+|\D+/)
    end
  end
end

lines = File.readlines("examples/22/221.txt")
# puts Day22.part_one(lines)
# puts Day22.part_two(lines) # Expectation: y = 10, x = 0, facing: left
lines = File.readlines("inputs/22.txt")
# puts Day22.part_one(lines)
puts Day22.part_two(lines)
