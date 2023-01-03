module Day23
  class << self
    def part_one(input)
      map = parse_input(input)
      print_map(map)

      compute_movement(map, 10)
      puts "done"
      print_map(map)
      parse_answer(map)
    end

    def part_two(input)
      map = parse_input(input)
      print_map(map)

      compute_movement(map, 10000)
    end

    def parse_input(input)
      size = input.length * 5
      map = []

      i = 0
      (1).step(size, 1) { |row|
        if row > input.length * 2 && row <= input.length * 3
          # puts input[i].strip
          map.append(Array.new(input.length * 2, ".") + input[i].strip.split("") + Array.new(input.length * 2, "."))
          i += 1
        else
          map.append(Array.new(input.length * 5, "."))
        end
      }
      map
    end

    #     y, x
    $nn = [-1, 0]
    $ne = [-1, 1]
    $ee = [0, 1]
    $se = [1, 1]
    $ss = [1, 0]
    $sw = [1, -1]
    $ww = [0, -1]
    $nw = [-1, -1]

    $dirs = [
      $nn, # NORTH 0
      $ne,
      $ss, # SOUTH 2
      $se,
      $ww, # WEST 4
      $nw,
      $ee, # EAST 6
      $sw,
    ]

    $dirs_associated = {
      $nn => [$nw, $nn, $ne],
      $ss => [$sw, $ss, $se],
      $ww => [$nw, $ww, $sw],
      $ee => [$ne, $ee, $se],
    }

    $dir_to_string = {
      $nn => "N",
      $ss => "S",
      $ww => "W",
      $ee => "E",
    }

    $string_to_dir = {
      "N" => $nn,
      "S" => $ss,
      "W" => $ww,
      "E" => $ee,
    }

    $idx = 0

    def compute_movement(map, rounds)
      occupied = ["#", "N", "S", "W", "E"]
      moving = ["N", "S", "W", "E"]
      1.step(rounds, 1) { |r|
        # puts "Round #{r} start: idx: #{$idx}"
        # print_map(map)
        0.step(map.length - 1, 1) { |row_y|
          0.step(map[row_y].length - 1, 1) { |col_x|
            # Find a proposed spot for this # to move
            if map[row_y][col_x] == "#"
              # is any direction around the elf not empty?
              if $dirs.any? { |dir|
                occupied.include? (map[row_y + dir[0]][col_x + dir[1]])
              }
                0.step(7, 2) { |i|
                  # find a direction to propose moving in
                  dir = $dirs[($idx + i) % $dirs.length]
                  associated_dirs = $dirs_associated[dir]
                  if associated_dirs.any? { |ass_dir| occupied.include?(map[row_y + ass_dir[0]][col_x + ass_dir[1]]) }
                    next
                  end
                  # This is a valid direction to move in
                  map[row_y][col_x] = $dir_to_string[dir]
                  if map[row_y + dir[0]][col_x + dir[1]] == "."
                    map[row_y + dir[0]][col_x + dir[1]] = 1
                  else
                    map[row_y + dir[0]][col_x + dir[1]] += 1
                  end
                  break
                }
              end
            end
          }
        }

        movement = false
        # puts "Round #{r} with movement plans: idx: #{$idx}"
        # print_map(map)
        # Move elves which were allowed to move, all elves should be # after this
        0.step(map.length - 1, 1) { |row_y|
          0.step(map[row_y].length - 1, 1) { |col_x|
            if moving.include? (map[row_y][col_x])
              dir = $string_to_dir[map[row_y][col_x]]
              if map[row_y + dir[0]][col_x + dir[1]] == 1
                # only one guy is moving here, this is valid
                map[row_y + dir[0]][col_x + dir[1]] = "#"
                map[row_y][col_x] = "."
                movement = true
                if row_y == 0
                  puts "uh oh, moving past y 0"
                end
                if col_x == 0
                  puts "uh oh, moving past x 0"
                end
                if row_y >= map.length
                  puts "uh oh, moving past y max"
                end
                if col_x >= map[row_y].length
                  puts "uh oh, moving past x max"
                end
              else
                map[row_y][col_x] = "#"
              end
            end
          }
        }

        return r unless movement
        puts "movement in #{r}"

        # cleanup, change all numbers to .
        0.step(map.length - 1, 1) { |row_y|
          0.step(map[row_y].length - 1, 1) { |col_x|
            if map[row_y][col_x].is_a? Integer
              map[row_y][col_x] = "."
            end
          }
        }

        $idx = ($idx + 2) % $dirs.length
      }
    end

    def parse_answer(map)
      min_y = 999
      max_y = 0
      min_x = 999
      max_x = 0
      count = 0
      0.step(map.length - 1, 1) { |row_y|
        0.step(map[row_y].length - 1, 1) { |col_x|
          if map[row_y][col_x] == "#"
            count += 1
            min_y = row_y < min_y ? row_y : min_y
            min_x = col_x < min_x ? col_x : min_x
            max_y = row_y > max_y ? row_y : max_y
            max_x = col_x > max_x ? col_x : max_x
          end
        }
      }
      puts "Max x #{max_x} Min x #{min_x} Max y #{max_y} Min y #{min_y}"
      return ((max_x - min_x + 1) * (max_y - min_y + 1)) - count
    end

    def print_map(map)
      map.each do |line|
        puts line.to_s
      end
    end
  end
end

lines = File.readlines("examples/23/23.txt")
# puts Day23.part_one(lines)
# puts Day23.part_two(lines) # Expectation: y = 10, x = 0, facing: left
lines = File.readlines("inputs/23.txt")
# puts Day23.part_one(lines)
puts Day23.part_two(lines)
